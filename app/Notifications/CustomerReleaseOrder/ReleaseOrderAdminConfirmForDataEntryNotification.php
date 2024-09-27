<?php

namespace App\Notifications\CustomerReleaseOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReleaseOrderAdminConfirmForDataEntryNotification extends Notification
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

        if ($this->eventType === 'confirmed') {
            $message = [
                'ar' => ' تم قبول طلب الارجاع للعميل   ' . $this->user->name,
                'en' => ' The release order Approved For ' . $this->user->name,
            ];
        }elseif($this->eventType === 'rejected') {

            $message = [
                'ar' => ' تم رفض طلب الارجاع للعميل  ' . $this->user->name,
                'en' => ' The release order Rejected For' . $this->user->name,
            ];
        }
        return [
            'message' => $message,
            'url'=> route('admin.show.order', $this->order->id),

        ];
    }
}
