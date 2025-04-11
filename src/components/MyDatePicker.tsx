import React, { useState } from 'react';
import { TextField } from '@mui/material';

type SimpleDatePickerProps = {
    date: Date;
    changeDate: (date: Date) => void;
    // setDate: React.Dispatch<React.SetStateAction<Date>>;
};

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({ date, changeDate }) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value;
        const [day, month, year] = inputDate.split('/').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        // console.log(inputDate);
        // console.log(day, month, year);
        // console.log('Parsed Date:', parsedDate);

        // Check if the input is a valid date
        if (!isNaN(parsedDate.getTime())) {
            changeDate(parsedDate);
            // console.log('Valid Date:', parsedDate);
        } else {
            console.log('Invalid Date');
        }
    };

    return (
        <div>
            <TextField
                label="Enter Date (DD/MM/YYYY)"
                type="text"
                onChange={handleDateChange}
                placeholder="10/04/2023"
                fullWidth
            />
        </div>
    );
};

export default SimpleDatePicker;