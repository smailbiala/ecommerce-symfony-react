<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices and accessories for everyday use',
                'reference' => 'category-electronics'
            ],
            [
                'name' => 'Clothing',
                'description' => 'Fashion items for men, women, and children',
                'reference' => 'category-clothing'
            ],
            [
                'name' => 'Books',
                'description' => 'Fiction and non-fiction books across various genres',
                'reference' => 'category-books'
            ],
            [
                'name' => 'Home & Kitchen',
                'description' => 'Products for your home and kitchen needs',
                'reference' => 'category-home'
            ],
            [
                'name' => 'Sports & Outdoors',
                'description' => 'Equipment and accessories for sports and outdoor activities',
                'reference' => 'category-sports'
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = new Category();
            $category->setName($categoryData['name']);
            $category->setDescription($categoryData['description']);
            
            $manager->persist($category);
            $this->addReference($categoryData['reference'], $category);
        }

        $manager->flush();
    }
}