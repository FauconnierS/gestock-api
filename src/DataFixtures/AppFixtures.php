<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    private $encoder ; 

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this -> encoder = $encoder;
    }
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for($u = 0 ; $u < 10 ; $u ++){

            $chrono = 1 ;
            $user = new User();
            $genreU = $faker -> randomElement(['male', 'female']);

            $user -> setFirstName($faker -> firstName($gender = $genreU))
                  -> setLastName($faker -> lastName($gender = $genreU))
                  -> setEmail($faker -> email)
                  -> setPassword($this -> encoder -> encodePassword($user ,'password'));
            
            $manager -> persist($user);

            for($c = 0 ; $c < mt_rand(5,11) ; $c ++ ){

                $genreC = $faker -> randomElement(['male', 'female']);
                $customer = new Customer();

                $customer -> setFirstName($faker -> firstName($gender = $genreC))
                          -> setLastName($faker -> lastName($gender = $genreC))
                          -> setEmail($faker -> email)
                          -> setCompany($faker -> company)
                          -> setUser($user);
                
                $manager -> persist($customer);

                for($i = 0 ; $i < mt_rand(10,15); $i ++){

                    $invoice = new Invoice();

                    $invoice -> setAmount( $faker -> randomFloat(2,570,5000))
                             -> setSentAt($faker -> dateTimeBetween('-6month'))
                             -> setStatus( $faker -> randomElement(['PAID', 'SENT', 'CANCELLED']))
                             -> setCustomer($customer)
                             -> setChrono($chrono);

                    $chrono ++ ;
                    $manager -> persist($invoice);
                }
            }
        }
        
        $manager->flush();
    }
}
