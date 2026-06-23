import { toast } from 'sonner';

export const notifySuccess = (title: string, body: string): void => {
  toast.success(title, { description: body });
};

export const notifyError = (title: string, body: string): void => {
  toast.error(title, { description: body });
};
