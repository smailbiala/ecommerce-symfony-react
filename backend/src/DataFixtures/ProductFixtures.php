<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ProductFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $products = [
            [
                'name' => 'Smartphone X',
                'description' => 'Latest smartphone with advanced features',
                'price' => 899.99,
                'imageUrl' => 'https://mediazone.ma/product/images/16210-gotlsYej/apple-iphone-16-512go-teal-maroc.webp',
                'stock' => 50,
                'category' => 'category-electronics',
                'reference' => 'product-smartphone'
            ],
            [
                'name' => 'Laptop Pro',
                'description' => 'High-performance laptop for professionals',
                'price' => 1299.99,
                'imageUrl' => 'https://www.apple.com/newsroom/images/product/mac/standard/MacBook-Air-gold-10302018_big.jpg.large.jpg',
                'stock' => 30,
                'category' => 'category-electronics',
                'reference' => 'product-laptop'
            ],
            [
                'name' => 'Wireless Headphones',
                'description' => 'Noise-cancelling wireless headphones',
                'price' => 199.99,
                'imageUrl' => 'https://i5.walmartimages.com/seo/SoundPlay-Foldable-Wireless-Headphones-Bluetooth-Over-Ear-Headset-with-Built-in-Mic_7781a45d-3746-4e57-9448-ed352177f124.e514a94af242606cd9abd487ef2bf27f.png',
                'stock' => 100,
                'category' => 'category-electronics',
                'reference' => 'product-headphones'
            ],
            
            [
                'name' => 'Casual T-Shirt',
                'description' => 'Comfortable cotton t-shirt for everyday wear',
                'price' => 24.99,
                'imageUrl' => 'https://img-lcwaikiki.mncdn.com/mnresize/1020/1360/pim/productimages/20241/6789715/v2/l_20241-s41461z8-fdu_a.jpg',
                'stock' => 200,
                'category' => 'category-clothing',
                'reference' => 'product-tshirt'
            ],
            [
                'name' => 'Denim Jeans',
                'description' => 'Classic denim jeans with modern fit',
                'price' => 59.99,
                'imageUrl' => 'https://thebrands.ma/cdn/shop/files/101.jpg?v=1701196182',
                'stock' => 150,
                'category' => 'category-clothing',
                'reference' => 'product-jeans'
            ],
            
            [
                'name' => 'The Great Novel',
                'description' => 'Bestselling fiction novel of the year',
                'price' => 19.99,
                'imageUrl' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaEZHL8E1qrxykr7O4pwUUVUdoYWsm4-y6Pw&s',
                'stock' => 75,
                'category' => 'category-books',
                'reference' => 'product-novel'
            ],
            [
                'name' => 'Cooking Masterclass',
                'description' => 'Learn to cook like a professional chef',
                'price' => 34.99,
                'imageUrl' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmx30ceQrfdMYYEOxROBpk_Q57hTf5WeAk3w&s',
                'stock' => 60,
                'category' => 'category-books',
                'reference' => 'product-cookbook'
            ],
            
            [
                'name' => 'Coffee Maker',
                'description' => 'Automatic coffee maker with timer',
                'price' => 89.99,
                'imageUrl' => 'https://cb.scene7.com/is/image/Crate/cb_dSEO_20230829_CoffeeMakers_SingleServe?wid=720&qlt=70&op_sharpen=1',
                'stock' => 40,
                'category' => 'category-home',
                'reference' => 'product-coffeemaker'
            ],
            [
                'name' => 'Kitchen Knife Set',
                'description' => 'Professional 5-piece kitchen knife set',
                'price' => 129.99,
                'imageUrl' => 'https://m.media-amazon.com/images/I/718iZVcnVEL.jpg',
                'stock' => 25,
                'category' => 'category-home',
                'reference' => 'product-knifeset'
            ],
            
            [
                'name' => 'Yoga Mat',
                'description' => 'Non-slip yoga mat for home workouts',
                'price' => 29.99,
                'imageUrl' => 'https://m.media-amazon.com/images/I/81fBVCWpbKL._AC_UF350,350_QL80_DpWeblab_.jpg ',
                'stock' => 120,
                'category' => 'category-sports',
                'reference' => 'product-yogamat'
            ],
            [
                'name' => 'Running Shoes',
                'description' => 'Lightweight running shoes with cushioned soles',
                'price' => 79.99,
                'imageUrl' => 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1741889693-asic-superblast-2-67d32026850eb.jpg?crop=0.803xw:0.803xh;0.109xw,0.0673xh&resize=980:*',
                'stock' => 80,
                'category' => 'category-sports',
                'reference' => 'product-shoes'
            ],
        ];

        foreach ($products as $productData) {
            $product = new Product();
            $product->setName($productData['name']);
            $product->setDescription($productData['description']);
            $product->setPrice($productData['price']);
            $product->setImageUrl($productData['imageUrl']);
            $product->setStock($productData['stock']);
            $product->setCategory($this->getReference($productData['category'], Category::class));
            
            $manager->persist($product);
            $this->addReference($productData['reference'], $product);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CategoryFixtures::class,
        ];
    }
}