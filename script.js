document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const modal = document.getElementById('card-modal');
    const addCardButtons = document.querySelectorAll('.add-card');
    const closeModal = document.querySelector('.close-modal');
    const cardForm = document.getElementById('card-form');
    const columns = document.querySelectorAll('.kanban-column');
    
    // Открытие модального окна
    addCardButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('target-column').value = this.dataset.column;
            modal.style.display = 'block';
        });
    });
    
    // Закрытие модального окна
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Создание новой карточки
    cardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('card-title').value;
        const description = document.getElementById('card-desc').value;
        const deadline = document.getElementById('card-deadline').value;
        const targetColumn = document.getElementById('target-column').value;
        
        // Создаем элемент карточки
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            ${deadline ? `<div class="deadline">До: ${deadline}</div>` : ''}
        `;
        
        // Добавляем карточку в нужную колонку
        document.querySelector(`.cards-container[data-column="${targetColumn}"]`).appendChild(card);
        
        // Сбрасываем форму и закрываем модальное окно
        cardForm.reset();
        modal.style.display = 'none';
        
        // Добавляем обработчики drag-and-drop для новой карточки
        setupDragAndDrop(card);
    });
    
    // Настройка drag-and-drop для всех карточек
    function setupDragAndDrop(card) {
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', 'card');
            setTimeout(() => {
                card.style.display = 'none';
            }, 0);
        });
        
        card.addEventListener('dragend', function() {
            card.style.display = 'block';
        });
    }
    
    // Настройка зон для drop
    columns.forEach(column => {
        const cardsContainer = column.querySelector('.cards-container');
        
        cardsContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            const afterElement = getDragAfterElement(cardsContainer, e.clientY);
            const draggable = document.querySelector('.card[draggable="true"]');
            
            if (afterElement == null) {
                cardsContainer.appendChild(draggable);
            } else {
                cardsContainer.insertBefore(draggable, afterElement);
            }
        });
    });
    
    // Вспомогательная функция для определения позиции
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Инициализация существующих карточек
    document.querySelectorAll('.card').forEach(card => {
        setupDragAndDrop(card);
    });
});