import { ReactNode } from 'react';
import { Modal } from '../modal';
import { useParams } from 'react-router-dom';

type OrderModalProps = {
  onClose: () => void;
  children: ReactNode;
};

const PAD_LENGTH = 6;
const PAD_CHAR = '0';

export const OrderModal = ({ onClose, children }: OrderModalProps) => {
  const params = useParams<{ number: string }>();

  const orderNumber = params.number?.padStart(PAD_LENGTH, PAD_CHAR) ?? '';
  const modalTitle = orderNumber ? `#${orderNumber}` : '';

  return (
    <Modal title={modalTitle} onClose={onClose}>
      {children}
    </Modal>
  );
};
