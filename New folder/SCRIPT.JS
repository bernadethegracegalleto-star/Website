document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('evaluationForm');
    
    // --- Star Rating Logic ---
    const starContainers = document.querySelectorAll('.stars');

    starContainers.forEach(container => {
        const inputField = document.getElementById(container.dataset.ratingId);
        const stars = container.querySelectorAll('.star');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                inputField.value = value; // Update the hidden input value
                
                // Set the 'selected' class for all stars up to the clicked one
                stars.forEach(s => {
                    s.classList.toggle('selected', parseInt(s.dataset.value) <= value);
                });
            });
        });
    });

    // --- Form Submission Logic ---
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the default form submission

        // 1. Collect all form data
        const formData = new FormData(form);
        const evaluationData = {};
        
        // Convert FormData to a JavaScript object
        for (let [key, value] of formData.entries()) {
            evaluationData[key] = value;
        }

        // 2. Separate Service Scores from main data
        const serviceScores = {};
        const staffCriteria = ['initiative', 'dependability', 'leadership', /* ... other criteria ... */];

        staffCriteria.forEach(criteria => {
            if (evaluationData[criteria]) {
                serviceScores[criteria] = parseInt(evaluationData[criteria]);
                delete evaluationData[criteria]; // Remove from main object
            }
        });

        // Final payload structure
        const finalPayload = {
            evaluator: {
                firstName: evaluationData.evaluatorFirstName,
                lastName: evaluationData.evaluatorLastName,
                phone: evaluationData.phone,
                email: evaluationData.email
            },
            serviceEvaluation: serviceScores,
            overallRatings: {
                overallService: parseInt(evaluationData.overall_service_rating) || 0,
                recommendation: parseInt(evaluationData.recommendation_likelihood) || 0
            },
            comments: evaluationData.comments
        };

        console.log('--- Submission Payload (Ready for Back-End) ---');
        console.log(finalPayload);
        
        // 3. Send the data to the Back-End API
        // This is where you would make an AJAX/fetch call to your server:
        /*
        fetch('/api/evaluations/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload)
        })
        .then(response => response.json())
        .then(data => {
            alert('Evaluation submitted successfully!');
            form.reset(); // Clear the form
        })
        .catch(error => {
            console.error('Error submitting evaluation:', error);
            alert('An error occurred during submission.');
        });
        */
    });
});