<?php

namespace App\Notifications\AdditionOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdditionOrderChangeStatusNotification extends Notification
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
                'en' => 'Products Addditions Order has been Approved by Admin for the customer. ' . $this->user->name,
                'ar' => 'تم قبول طلب تخزين منتجات من الاداره للعميل ' . $this->user->name,
            ];
        } elseif ($this->eventType === 'rejected') {
            $message = [
                'en' => 'Products Addditions Order has been Rejected by Admin for the customer ' . $this->user->name,
                'ar' => 'تم رفض طلب تخزين منتجات من الاداره للعميل ' . $this->user->name,
            ];
        }

        return [
            'message' => $message,
            'url'=> route('stock.show.order', $this->order->id),
            'model'=>'App\Models\Product\ReceiveOrder',
            'order_id'=>$this->order->id,
        ];

    }
}
