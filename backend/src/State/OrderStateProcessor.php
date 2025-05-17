<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Order;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class OrderStateProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service:'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $innerProcessor,
        private Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ?Order
    {
        if ($data instanceof Order) {
            $user = $this->security->getUser();
            if ($user) {
                $data->setUser($user);
            }
        }

        $this->innerProcessor->process($data, $operation, $uriVariables, $context);
        
        return $data;
    }
}