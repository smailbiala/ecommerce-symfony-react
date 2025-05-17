<?php

namespace App\DataFixtures;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class OrderFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $orders = [
            [
                'user' => 'user-john',
                'status' => 'paid',
                'createdAt' => new \DateTime('2023-06-15'),
                'paymentDate' => new \DateTime('2023-06-15'),
                'shippingAddress' => '123 Main St, Anytown, AN 12345',
                'billingAddress' => '123 Main St, Anytown, AN 12345',
                'items' => [
                    ['product' => 'product-smartphone', 'quantity' => 1],
                    ['product' => 'product-headphones', 'quantity' => 1],
                ]
            ],
            [
                'user' => 'user-john',
                'status' => 'pending',
                'createdAt' => new \DateTime('2023-07-20'),
                'paymentDate' => null,
                'shippingAddress' => '123 Main St, Anytown, AN 12345',
                'billingAddress' => '123 Main St, Anytown, AN 12345',
                'items' => [
                    ['product' => 'product-tshirt', 'quantity' => 2],
                    ['product' => 'product-jeans', 'quantity' => 1],
                ]
            ],
            [
                'user' => 'user-jane',
                'status' => 'paid',
                'createdAt' => new \DateTime('2023-05-10'),
                'paymentDate' => new \DateTime('2023-05-10'),
                'shippingAddress' => '456 Oak Ave, Somewhere, SM 67890',
                'billingAddress' => '456 Oak Ave, Somewhere, SM 67890',
                'items' => [
                    ['product' => 'product-yogamat', 'quantity' => 1],
                    ['product' => 'product-cookbook', 'quantity' => 1],
                ]
            ],
            [
                'user' => 'user-jane',
                'status' => 'shipped',
                'createdAt' => new \DateTime('2023-07-05'),
                'paymentDate' => new \DateTime('2023-07-05'),
                'shippingAddress' => '456 Oak Ave, Somewhere, SM 67890',
                'billingAddress' => '456 Oak Ave, Somewhere, SM 67890',
                'items' => [
                    ['product' => 'product-coffeemaker', 'quantity' => 1],
                ]
            ],
            [
                'user' => 'user-bob',
                'status' => 'paid',
                'createdAt' => new \DateTime('2023-06-25'),
                'paymentDate' => new \DateTime('2023-06-25'),
                'shippingAddress' => '789 Pine Blvd, Elsewhere, EL 13579',
                'billingAddress' => '789 Pine Blvd, Elsewhere, EL 13579',
                'items' => [
                    ['product' => 'product-laptop', 'quantity' => 1],
                    ['product' => 'product-novel', 'quantity' => 2],
                ]
            ],
        ];

        foreach ($orders as $orderData) {
            $order = new Order();
            $order->setUser($this->getReference($orderData['user'], User::class));
            $order->setStatus($orderData['status']);
            $order->setCreatedAt($orderData['createdAt']);
            $order->setPaymentDate($orderData['paymentDate']);
            $order->setShippingAddress($orderData['shippingAddress']);
            $order->setBillingAddress($orderData['billingAddress']);
            
            foreach ($orderData['items'] as $itemData) {
                $orderItem = new OrderItem();
                $orderItem->setProduct($this->getReference($itemData['product'], Product::class));
                $orderItem->setQuantity($itemData['quantity']);
                $order->addOrderItem($orderItem);
            }
            
            $manager->persist($order);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            ProductFixtures::class,
        ];
    }
}