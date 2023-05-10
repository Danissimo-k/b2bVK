import React, { FC } from 'react';
import { Form } from '@src/features/bookMeetingRoom/components';
import styles from './FormPage.module.scss';

/**
 * Form page.
 */
export const FormPage: FC = () => (
  <div className={styles.pageWrapper}>
    <div className={styles.title}>Бронировние переговорной</div>
    <Form />
  </div>
);
