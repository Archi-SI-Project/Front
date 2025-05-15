import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

type SimpleDatePickerProps = {
    date: Date;
    changeDate: (date: Date) => void;
};

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({ date, changeDate }) => {
    const [inputValue, setInputValue] = useState('');

    // Synchronise l'affichage si la prop date change
    useEffect(() => {
        if (date) {
            setInputValue(
                `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}/${date.getFullYear()}`
            );
        } else {
            setInputValue('');
        }
    }, [date]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        const [day, month, year] = e.target.value.split('/').map(Number);
        const parsedDate = new Date(year, month - 1, day, 12, 0, 0, 0);

        if (
            !isNaN(parsedDate.getTime()) &&
            day > 0 && day <= 31 &&
            month > 0 && month <= 12 &&
            year > 1000
        ) {
            changeDate(parsedDate);
        }
    };

    return (
        <div>
            <TextField
                label="Enter Date (DD/MM/YYYY)"
                type="text"
                value={inputValue}
                onChange={handleDateChange}
                placeholder="10/04/2023"
                fullWidth
            />
        </div>
    );
};

export default SimpleDatePicker;