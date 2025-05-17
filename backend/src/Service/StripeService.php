<?php


namespace App\Service;

use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;

class StripeService
{

    public function __construct(
        private OrderRepository $orderRepository,
        private EntityManagerInterface $entityManager
    ) {}
    public function handleSuccessfulPayment($session): void
    {
        $orderId = $session->metadata->order_id;
        $order = $this->orderRepository->find($orderId);

        if (!$order) {
            throw new \Exception('Order not found');
        }

        $order->setStatus('paid');
        $order->setPaymentDate(new \DateTime());
        $order->setStripePaymentId($session->payment_intent);

        foreach ($order->getOrderItems() as $item) {
            $product = $item->getProduct();
            $newStock = $product->getStock() - $item->getQuantity();
            $product->setStock(max(0, $newStock));
        }

        $this->entityManager->flush();
    }
}