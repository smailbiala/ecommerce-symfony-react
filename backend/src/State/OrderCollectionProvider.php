<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Order;
use App\Repository\OrderRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class OrderCollectionProvider implements ProviderInterface
{
    private ProviderInterface $collectionProvider;
    private Security $security;
    private OrderRepository $orderRepository;

    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.collection_provider')]
        ProviderInterface $collectionProvider,
        Security $security,
        OrderRepository $orderRepository
    ) {
        $this->collectionProvider = $collectionProvider;
        $this->security = $security;
        $this->orderRepository = $orderRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return $this->collectionProvider->provide($operation, $uriVariables, $context);
        }

        $user = $this->security->getUser();
        if ($user) {
            return $this->orderRepository->findBy(['user' => $user]);
        }

        return [];
    }
}