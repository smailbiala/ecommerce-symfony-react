<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserHashPasswordStateProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire('api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $innerProcessor,
        private UserPasswordHasherInterface $userPasswordHasher
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if ($data instanceof User && $data->getPlainPassword()) {
            $data->setPassword($this->userPasswordHasher->hashPassword($data, $data->getPlainPassword()));
        }

        $this->innerProcessor->process($data, $operation, $uriVariables, $context);
    }
}
