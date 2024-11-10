<?php

namespace App\Notifications\AdditionOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MyAdditionOrderChangeStatusNotification extends Notification
{
    use Queueable;

    public $order;
    public $user;
    public $eventType;

    public function __construct($order, $user, $eventType)
    {
        $this->order = $order;
        $this->user = $user;
        $this->eventType = $eventType;

    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }


    public function toArray($notifiable)
    {
        $message = '';

        if ($this->eventType === 'approved') {
            $message = [
                'ar' => ' تم تخزين منتجات من الاداره',
                'en' => 'Products has been Added by Admin ',

            ];
        }

        return [
            'message' => $message,
            'url'=> route('for-customer-my-products-report'),
            'model'=>'App\Models\Product\ReceiveOrder',
            'order_id'=>$this->order->id,
        ];

    }
}
