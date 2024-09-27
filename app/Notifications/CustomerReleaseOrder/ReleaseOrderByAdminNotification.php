<?php

namespace App\Notifications\CustomerReleaseOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReleaseOrderByAdminNotification extends Notification
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
                'en' => ' Release Order Made by Admin',
                'ar' => ' تم إضافة طلب ارجاع منتجات عن طريق الاداره ',
            ];
        } elseif ($this->eventType === 'updated') {
            $message = [
                'en' => ' Release Order Updated by Admin ',
                'ar' => ' تم تحديث طلب ارجاع منتجات عن طريق الاداره ',
            ];
        }

        return [
            'message' => $message,
            'url'=> route('customer.show-release-order', $this->order->id),

        ];

    }
}
