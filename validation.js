document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('.contacts__form');

	// Добавляем обработчики для всех полей
	form.querySelectorAll('input, textarea').forEach((input) => {
		// Помечаем поле как "тронутое" при первом взаимодействии
		const markAsTouched = () => {
			input.classList.add('touched');
			// Удаляем этот обработчик после первого использования
			input.removeEventListener('blur', markAsTouched);
		};

		// Обработчики событий
		input.addEventListener('input', () => validateField(input));
		input.addEventListener('blur', markAsTouched);
		input.addEventListener('blur', () => validateField(input));
	});

	// Обработчик отправки формы
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Помечаем все поля как "тронутые" при попытке отправки
		form.querySelectorAll('input, textarea').forEach((input) => {
			input.classList.add('touched');
		});

		// Валидируем все поля перед отправкой
		let isValid = true;
		form.querySelectorAll('input, textarea').forEach((input) => {
			if (!validateField(input)) isValid = false;
		});

		if (!isValid) {
			// Показываем первую ошибку для удобства пользователя
			const firstError = form.querySelector('.error');
			if (firstError) {
				firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
			return;
		}

		// Здесь можно добавить отправку формы (fetch)
		console.log('Форма валидна, отправляем данные...');
		// const formData = new FormData(form);
		// const response = await fetch('/api/submit', { method: 'POST', body: formData });
	});

	/**
	 * Валидация поля формы
	 * @param {HTMLElement} field - Поле для валидации
	 * @returns {boolean} true если поле валидно
	 */
	function validateField(field) {
		const errorElement = field
			.closest('.contacts__input, .contacts__textarea, .contacts__policy')
			?.querySelector('.error-message');

		if (!errorElement) return true;

		// Специальная обработка для чекбокса
		if (field.type === 'checkbox') {
			return validateCheckbox(field, errorElement);
		}

		// Если поле валидно
		if (field.validity.valid) {
			errorElement.textContent = '';
			errorElement.classList.remove('error');
			return true;
		}

		// Если поле невалидно
		errorElement.classList.add('error');

		// Определяем тип ошибки
		if (field.validity.valueMissing) {
			errorElement.textContent = 'Поле обязательно для заполнения';
		} else if (field.validity.typeMismatch) {
			errorElement.textContent = 'Пожалуйста, введите корректный email';
		} else if (field.validity.tooShort) {
			errorElement.textContent = `Минимальная длина: ${field.minLength} символов (сейчас: ${field.value.length})`;
		} else if (field.validity.tooLong) {
			errorElement.textContent = `Максимальная длина: ${field.maxLength} символов (сейчас: ${field.value.length})`;
		} else if (field.validity.patternMismatch) {
			errorElement.textContent = 'Разрешены только буквы и пробелы';
		} else {
			errorElement.textContent = 'Некорректное значение';
		}

		return false;
	}

	/**
	 * Валидация чекбокса
	 * @param {HTMLElement} checkbox - Чекбокс
	 * @param {HTMLElement} errorElement - Элемент для отображения ошибки
	 * @returns {boolean} true если чекбокс отмечен
	 */
	function validateCheckbox(checkbox, errorElement) {
		if (checkbox.checked) {
			errorElement.textContent = '';
			errorElement.classList.remove('error');
			return true;
		}

		errorElement.textContent = 'Необходимо ваше согласие';
		errorElement.classList.add('error');
		return false;
	}
});
