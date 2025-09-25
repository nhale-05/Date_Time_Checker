function validateDate() {
    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    
    const resultDiv = document.getElementById('result');
    
    // Check if all fields are filled
    if (!day || !month || !year) {
        showResult('Please enter all fields (day, month, year)!', false);
        return;
    }
    
    // Basic value validation
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1) {
        showResult('Invalid values! Day must be 1-31, Month 1-12, Year > 0', false);
        return;
    }
    
    // Advanced validation with detailed constraints
    const validationResult = validateDateConstraints(day, month, year);
    
    if (validationResult.isValid) {
        const formattedDate = formatDate(day, month, year);
        const weekday = getWeekday(year, month - 1, day);
        showResult(`${formattedDate} is valid`, true, weekday);
    } else {
        showResult(validationResult.errorMessage, false);
    }
}

function formatDate(day, month, year) {
    // Chuyển đổi năm thành định dạng 2 chữ số cuối (yy)
    const shortYear = year % 100;
    
    // Đảm bảo định dạng 2 chữ số cho ngày, tháng và năm
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedYear = shortYear.toString().padStart(2, '0');
    
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
}

function validateDateConstraints(day, month, year) {
    // Check if year is a leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
    // Days in each month (non-leap year)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Adjust February for leap year
    if (month === 2 && isLeapYear) {
        daysInMonth[1] = 29;
    }
    
    // Check if day is valid for the given month
    if (day > daysInMonth[month - 1]) {
        if (month === 2) {
            return {
                isValid: false,
                errorMessage: `February ${isLeapYear ? '29' : '28'} is the maximum day for ${year}${isLeapYear ? ' (leap year)' : ''}`
            };
        } else {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
            return {
                isValid: false,
                errorMessage: `${monthNames[month - 1]} only has ${daysInMonth[month - 1]} days`
            };
        }
    }
    
    // Additional validation using Date object
    const date = new Date(year, month - 1, day);
    const isValid = date.getDate() === day && 
                   date.getMonth() === month - 1 && 
                   date.getFullYear() === year;
    
    if (!isValid) {
        return {
            isValid: false,
            errorMessage: 'Invalid date combination!'
        };
    }
    
    return { isValid: true };
}

function getWeekday(year, month, day) {
    const date = new Date(year, month, day);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
}

function showResult(message, isValid, weekday = null) {
    const resultDiv = document.getElementById('result');
    
    if (isValid && weekday) {
        resultDiv.innerHTML = `
            <div>${message}</div>
            <div class="weekday">${weekday}</div>
        `;
    } else {
        resultDiv.innerHTML = `<div>${message}</div>`;
    }
    
    resultDiv.className = `result ${isValid ? 'valid' : 'invalid'}`;
    resultDiv.style.display = 'flex';
}

// Add Enter key functionality
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateDate();
            }
        });
        
        // Only allow numbers
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    });
    
    // Auto focus on first field when page loads
    document.getElementById('day').focus();
});
