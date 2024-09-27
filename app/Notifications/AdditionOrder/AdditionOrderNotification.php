<?php

namespace App\Notifications\AdditionOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdditionOrderNotification extends Notification
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

        if ($this->eventType === 'added') {
            $message = [
                'en' => 'New order added by ' . $this->user->name,
                'ar' => 'تم إضافة طلب تخزين منتجات بواسطة ' . $this->user->name,
            ];
        } elseif ($this->eventType === 'updated') {
            $message = [
                'en' => 'Order updated by ' . $this->user->name,
                'ar' => 'تم تحديث طلب تخزين منتجات بواسطة ' . $this->user->name,
            ];
        }

        return [
            'message' => $message,
            'url'=> route('admin.show.order', $this->order->id),

        ];

    }
}
