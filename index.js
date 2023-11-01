document.addEventListener("DOMContentLoaded", function () {
    const exerciseList = document.getElementById("exercise-list");
    const exerciseForm = document.getElementById("exercise-form");
    const activityTypeInput = document.getElementById("activity-type");
    const distanceInput = document.getElementById("distance");
    const dateCompletedInput = document.getElementById("date-completed");

    // Function to fetch and display exercises
    async function fetchExercises() {
        try {
            const response = await fetch("/api/exercises"); // Replace with your actual API endpoint
            if (response.ok) {
                const exercises = await response.json();
                exerciseList.innerHTML = ""; // Clear existing list
                exercises.forEach((exercise) => {
                    // Create and append exercise elements to the list
                    const exerciseItem = document.createElement("tr");
                    exerciseItem.innerHTML = `
                        <td>${exercise.activity_type}</td>
                        <td>${exercise.distance_miles}</td>
                        <td>${exercise.date_completed}</td>
                        <td>
                            <button class="pin-button" data-id="${exercise.id}">Pin</button>
                            <button class="delete-button" data-id="${exercise.id}">Delete</button>
                        </td>
                    `;

                    // Add event listeners for pin and delete buttons
                    const pinButton = exerciseItem.querySelector(".pin-button");
                    pinButton.addEventListener("click", () => pinExercise(exercise.id));
                    const deleteButton = exerciseItem.querySelector(".delete-button");
                    deleteButton.addEventListener("click", () => deleteExercise(exercise.id));

                    exerciseList.appendChild(exerciseItem);
                });
            }
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    }

    // Function to add a new exercise
    async function addExercise() {
        const newExercise = {
            activity_type: activityTypeInput.value,
            distance_miles: parseFloat(distanceInput.value),
            date_completed: dateCompletedInput.value,
        };

        try {
            const response = await fetch("/api/exercises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newExercise),
            });
            if (response.ok) {
                // Clear the form inputs and fetch exercises to update the list
                activityTypeInput.value = "";
                distanceInput.value = "";
                dateCompletedInput.value = "";
                fetchExercises();
            }
        } catch (error) {
            console.error("Error adding exercise:", error);
        }
    }

    // Function to pin/unpin an exercise
    async function pinExercise(exerciseId) {
        try {
            const response = await fetch(`/api/exercises/${exerciseId}/pin`, {
                method: "PUT",
            });
            if (response.ok) {
                fetchExercises(); // Update the exercise list after pinning/unpinning
            }
        } catch (error) {
            console.error("Error pinning/unpinning exercise:", error);
        }
    }

    // Function to delete an exercise
    async function deleteExercise(exerciseId) {
        try {
            const response = await fetch(`/api/exercises/${exerciseId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchExercises(); // Update the exercise list after deleting
            }
        } catch (error) {
            console.error("Error deleting exercise:", error);
        }
    }

    // Attach a submit event listener to the exercise form
    exerciseForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting
        addExercise();
    });

    // Fetch and display exercises when the page loads
    fetchExercises();
});
