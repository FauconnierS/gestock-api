<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSuscriber
{

    public function updateJwtData(JWTCreatedEvent $event)
    {
        $event->setData(
            $event->getData() +
                [
                    "firstName" => $event->getUser()->getFirstName(),
                    "lastName" => $event->getUser()->getLastName()
                ]
        );
    }
}
