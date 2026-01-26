export class CreateNotificationDto {
    user: string;
    title: string;
    message?: string;
    type?: string;
    jobRequest?: string;
}
