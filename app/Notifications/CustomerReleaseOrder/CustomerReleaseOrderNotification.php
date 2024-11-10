<?php

namespace App\Notifications\CustomerReleaseOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomerReleaseOrderNotification extends Notification
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
                'en' => ' New order Release added by Customer ' . $this->user->name,
                'ar' => ' تم إضافة طلب ارجاع من العميل ' . $this->user->name,
            ];
        } elseif ($this->eventType === 'updated') {
            $message = [
                'en' => ' Release Order updated by Customer ' . $this->user->name,
                'ar' => ' تم تحديث طلب ارجاع من العميل ' . $this->user->name,
            ];
        }

        return [
            'message' => $message,
            'url'=> route('admin.show.order', $this->order->id),
            'model'=>'App\Models\Warehouse\StockReleaseOrder',
            'order_id'=>$this->order->id,

        ];

    }
}
