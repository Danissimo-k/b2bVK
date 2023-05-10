import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { FC } from 'react';
import data from '@src/lib/data.json';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { ruRU } from '@mui/x-date-pickers/locales';
import ru from 'date-fns/locale/ru';
import { format } from 'date-fns';
import { Formik } from 'formik';
import { object, string, number, date } from 'yup';
import styles from './Form.module.scss';

const { floors } = data;
const { meetingRooms } = data;
const { towers } = data;

/**
 * Form for booking.
 */
export const Form: FC = () => {
  const initialValues = {
    tower: '',
    floor: '',
    meetingRoom: '',
    date: null,
    startTime: null,
    endTime: null,
    comment: '',
  };

  const validationSchema = object({
    tower: string().required(),
    floor: number().required(),
    meetingRoom: number().required(),
    date: date().required(),
    startTime: date().required(),
    endTime: date()
      .required()
      .when(
        'startTime',
        ([startTime], schema) => (startTime ? schema.min(startTime, 'notValidTimeRange') : schema),
      ),
    comment: string().optional(),
  });
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={values => {
        console.log({
          ...values,
          date: format(values.date as unknown as Date, 'yyyy.MM.dd'),
          startTime: format(values.startTime as unknown as Date, 'HH:mm'),
          endTime: format(values.endTime as unknown as Date, 'HH:mm'),
        });
      }}
    >
      {({
        setFieldValue,
        values,
        errors,
        handleChange,
        handleSubmit,
        setValues,
      }) => (
        <div className={styles.formWrapper}>
          <FormControl
            error={!!errors.tower}
            fullWidth
          >
            <InputLabel id="select-towers-label">Башни</InputLabel>
            <Select
              value={values.tower}
              name="tower"
              onChange={handleChange}
              labelId="select-towers-label"
              id="select-towers"
              label="Башни"
            >
              {
                towers.map(tower => (
                  <MenuItem key={tower.id} value={tower.id}>{`Башня ${tower.title}`}</MenuItem>
                ))
              }
            </Select>
            {errors.tower && <FormHelperText>Обязательное поле</FormHelperText>}
          </FormControl>
          <FormControl
            fullWidth
            error={!!errors.floor}
          >
            <InputLabel id="select-floors-label">Этажи</InputLabel>
            <Select
              name="floor"
              value={values.floor}
              onChange={handleChange}
              labelId="select-floors-label"
              id="select-floors"
              label="Этажи"
            >
              {
                floors.map(floor => (
                  <MenuItem key={floor.id} value={floor.id}>{`Этаж №${floor.id}`}</MenuItem>
                ))
              }
            </Select>
            {errors.floor && <FormHelperText>Обязательное поле</FormHelperText>}
          </FormControl>
          <FormControl
            fullWidth
            error={!!errors.meetingRoom}
          >
            <InputLabel id="select-meeting-rooms-label">Переговорная</InputLabel>
            <Select
              value={values.meetingRoom}
              name="meetingRoom"
              onChange={handleChange}
              labelId="select-meeting-rooms-label"
              id="select-floors"
              label="Переговорные"
            >
              {
                meetingRooms.map(meetingRoom => (
                  <MenuItem
                    key={meetingRoom.id}
                    value={meetingRoom.id}
                  >
                    {`Переговорная №${meetingRoom.id}`}
                  </MenuItem>
                ))
              }
            </Select>
            {errors.meetingRoom && <FormHelperText>Обязательное поле</FormHelperText>}
          </FormControl>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
            adapterLocale={ru}
          >
            <DatePicker
              value={values.date}
              onChange={value => setFieldValue('date', value)}
              label="Выберите дату бронирования"
              views={['year', 'month', 'day']}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.date,
                  helperText: errors.date ? 'Обязательное поле' : '',
                },
              }}
            />
          </LocalizationProvider>
          <div>
            <div className={styles.timeRangeLabel}>
              Интервал бронирования
            </div>
            <div className={styles.timeRange}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale={ru}
              >
                <TimePicker
                  value={values.startTime}
                  onChange={value => setFieldValue('startTime', value)}
                  ampm={false}
                  label="Начало"
                  slotProps={{
                    textField: {
                      error: !!errors.startTime,
                      helperText: errors.startTime ? 'Обязательное поле' : '',
                    },
                  }}
                />
              </LocalizationProvider>
              <div>
                -
              </div>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale={ru}
              >
                <TimePicker
                  value={values.endTime}
                  onChange={value => setFieldValue('endTime', value)}
                  ampm={false}
                  label="Конец"
                  slotProps={{
                    textField: {
                      error: !!errors.endTime,
                      helperText: !errors.endTime ?
                        '' :
                        errors.endTime === 'notValidTimeRange' ?
                          'Невалидный интервал' :
                          'Обязательное поле',
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <FormControl fullWidth>
            <TextField
              value={values.comment}
              name="comment"
              onChange={handleChange}
              label="Комментарии"
              multiline
              maxRows={7}
            />
          </FormControl>
          <div className={styles.buttons}>
            <Button variant="outlined" onClick={() => handleSubmit()}>Отправить</Button>
            <Button color="error" onClick={() => setValues(initialValues)} variant="outlined">Очистить</Button>
          </div>
        </div>
      )}
    </Formik>
  );
};
