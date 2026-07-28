export interface INotificationEmailSend {
    templateName: string;
    templateData?: Record<string, string>;
    sender: string;
    replyTo?: string;
    recipients: string[];
    cc?: string[];
    bcc?: string[];
}

export interface INotificationEmailSendBulkRecipient {
    recipient: string;
    templateData?: Record<string, string>;
}

export interface INotificationEmailSendBulk {
    templateName: string;
    sender: string;
    recipients: INotificationEmailSendBulkRecipient[];
    defaultTemplateData?: Record<string, string>;
}
