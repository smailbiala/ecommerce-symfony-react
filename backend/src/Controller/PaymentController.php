<?php

namespace App\Controller;

use App\Entity\Order;
use App\Repository\OrderRepository;
use App\Service\StripeService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[Route('/api', name: 'api_payment_')]
class PaymentController extends AbstractController
{
    private string $stripeSecretKey;
    private EntityManagerInterface $entityManager;
    private OrderRepository $orderRepository;

    public function __construct(
        #[Autowire('%stripe_secret_key%')] string $stripeSecretKey,
        EntityManagerInterface $entityManager,
        OrderRepository $orderRepository
    ) {
        $this->stripeSecretKey = $stripeSecretKey;
        $this->entityManager = $entityManager;
        $this->orderRepository = $orderRepository;
    }

    #[Route('/payment/create/{id}', name: 'create_session', methods: ['POST'])]
    public function createPaymentSession(Order $order): JsonResponse
    {
        if ($order->getUser() !== $this->getUser() && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Unauthorized access to this order'], Response::HTTP_FORBIDDEN);
        }

        if ($order->getStatus() !== 'pending') {
            return $this->json(['error' => 'This order cannot be paid'], Response::HTTP_BAD_REQUEST);
        }

        try {
            Stripe::setApiKey($this->stripeSecretKey);

            $lineItems = [];
            foreach ($order->getOrderItems() as $item) {
                $product = $item->getProduct();
                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $product->getName(),
                            'description' => $product->getDescription(),
                            'images' => [$product->getImageUrl()],
                        ],
                        'unit_amount' => (int)($product->getPrice() * 100), 
                    ],
                    'quantity' => $item->getQuantity(),
                ];
            }

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => $_ENV['FRONTEND_URL'] . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $_ENV['FRONTEND_URL'] . '/payment/cancel',
                'client_reference_id' => $order->getId(),
                'metadata' => [
                    'order_id' => $order->getId(),
                ],
            ]);

            $order->setStripeSessionId($session->id);
            $this->entityManager->flush();

            return $this->json(['sessionId' => $session->id, 'url' => $session->url]);
        } catch (ApiErrorException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/payment/webhook', name: 'webhook', methods: ['POST'])]
    public function handleWebhook(
        Request $request,
        #[Autowire('%stripe_webhook_secret%')] string $webhookSecret,
        StripeService $stripeService
    ): Response {
        $payload = $request->getContent();
        $sigHeader = $request->headers->get('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $webhookSecret
            );

            switch ($event->type) {
                case 'checkout.session.completed':
                    $session = $event->data->object;
                    $stripeService->handleSuccessfulPayment($session);
                    break;
            }

            return new Response('Webhook handled', Response::HTTP_OK);
        } catch (\UnexpectedValueException $e) {
            return new Response('Invalid payload', Response::HTTP_BAD_REQUEST);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return new Response('Invalid signature', Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return new Response('Error: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}