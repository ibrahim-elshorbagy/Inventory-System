<?php

namespace App\Notifications\CustomerReleaseOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReleaseOrderChangeStatusNotification extends Notification
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

        if ($this->eventType === 'status') {
            $message = [
                'ar' => ' تم تغير حالة طلب الارجاع الي ' . $this->order->status,
                'en' => ' The release order status changed to ' . $this->order->status,
            ];
        }
        return [
            'message' => $message,
            'url'=> route('customer.show-release-order', $this->order->id),
            'model'=>'App\Models\Warehouse\StockReleaseOrder',
            'order_id'=>$this->order->id,
        ];
    }
}
