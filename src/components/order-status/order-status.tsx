import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  let displayText = '';

  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      displayText = statusText.pending;
      break;
    case 'done':
      textStyle = '#00CCCC';
      displayText = statusText.done;
      break;
    case 'created':
      textStyle = '#F2F2F3';
      displayText = statusText.created;
      break;
  }

  return <OrderStatusUI textStyle={textStyle} text={displayText} />;
};
