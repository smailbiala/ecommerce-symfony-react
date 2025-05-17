<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setFirstName('Admin');
        $admin->setLastName('User');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPlainPassword('admin123');
        $admin->setPassword($this->passwordHasher->hashPassword(
            $admin,
            'admin123'
        ));
        $manager->persist($admin);
        $this->addReference('user-admin', $admin);

        $regularUsers = [
            [
                'email' => 'john@example.com',
                'firstName' => 'John',
                'lastName' => 'Doe',
                'password' => 'password123',
                'reference' => 'user-john'
            ],
            [
                'email' => 'jane@example.com',
                'firstName' => 'Jane',
                'lastName' => 'Smith',
                'password' => 'password123',
                'reference' => 'user-jane'
            ],
            [
                'email' => 'bob@example.com',
                'firstName' => 'Bob',
                'lastName' => 'Johnson',
                'password' => 'password123',
                'reference' => 'user-bob'
            ],
        ];

        foreach ($regularUsers as $userData) {
            $user = new User();
            $user->setEmail($userData['email']);
            $user->setFirstName($userData['firstName']);
            $user->setLastName($userData['lastName']);
            $user->setRoles(['ROLE_USER']);
            $user->setPlainPassword($userData['password']);
            $user->setPassword($this->passwordHasher->hashPassword(
                $user,
                $userData['password']
            ));
            $manager->persist($user);
            $this->addReference($userData['reference'], $user);
        }

        $manager->flush();
    }
}