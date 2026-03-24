const form = document.getElementById("prediction-form");
const predictBtn = document.getElementById("predict-btn");
const resultBox = document.getElementById("result");
const errorBox = document.getElementById("error");

function showResult(message) {
    resultBox.textContent = message;
    resultBox.classList.remove("hidden");
    errorBox.classList.add("hidden");
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
    resultBox.classList.add("hidden");
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const avgSessionLength = parseFloat(document.getElementById("avg_session_length").value);
    const timeOnApp = parseFloat(document.getElementById("time_on_app").value);
    const lengthOfMembership = parseFloat(document.getElementById("length_of_membership").value);

    predictBtn.disabled = true;
    predictBtn.textContent = "Hesaplaniyor...";

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Avg. Session Length": avgSessionLength,
                "Time on App": timeOnApp,
                "Length of Membership": lengthOfMembership
            })
        });

        if (!response.ok) {
            throw new Error("Tahmin istegi basarisiz oldu.");
        }

        const data = await response.json();
        const predicted = Number(data.predicted_spent).toFixed(2);
        showResult(`Tahmini Harcama: $${predicted}`);
    } catch (error) {
        showError("Bir hata olustu. Lutfen girdileri kontrol edip tekrar dene.");
    } finally {
        predictBtn.disabled = false;
        predictBtn.textContent = "Tahmini Hesapla";
    }
});
