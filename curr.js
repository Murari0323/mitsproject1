document.addEventListener('DOMContentLoaded', function() {
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertBtn');
    const swapBtn = document.getElementById('swapBtn');
    const resultContainer = document.getElementById('resultContainer');
    const convertedAmount = document.getElementById('convertedAmount');
    const conversionText = document.getElementById('conversionText');
    const lastUpdated = document.getElementById('lastUpdated');
    const detailsBtn = document.getElementById('detailsBtn');
    const detailsContainer = document.getElementById('detailsContainer');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    
    const exchangeRates = {
        USD: { EUR: 0.85, GBP: 0.73, JPY: 110.15, AUD: 1.32, CAD: 1.25, CHF: 0.92, CNY: 6.45, INR: 74.50 },
        EUR: { USD: 1.18, GBP: 0.86, JPY: 129.53, AUD: 1.55, CAD: 1.47, CHF: 1.08, CNY: 7.59, INR: 87.65 },
        GBP: { USD: 1.37, EUR: 1.16, JPY: 150.82, AUD: 1.81, CAD: 1.71, CHF: 1.26, CNY: 8.82, INR: 101.92 },
        JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, AUD: 0.012, CAD: 0.011, CHF: 0.0083, CNY: 0.058, INR: 0.68 },
        AUD: { USD: 0.76, EUR: 0.65, GBP: 0.55, JPY: 83.33, CAD: 0.95, CHF: 0.70, CNY: 4.89, INR: 56.44 },
        CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 90.91, AUD: 1.05, CHF: 0.74, CNY: 5.16, INR: 59.60 },
        CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 120.48, AUD: 1.43, CAD: 1.35, CNY: 7.01, INR: 80.98 },
        CNY: { USD: 0.16, EUR: 0.13, GBP: 0.11, JPY: 17.24, AUD: 0.20, CAD: 0.19, CHF: 0.14, INR: 11.55 },
        INR: { USD: 0.013, EUR: 0.011, GBP: 0.0098, JPY: 1.47, AUD: 0.018, CAD: 0.017, CHF: 0.012, CNY: 0.087 }
    };
    
    
    const historicalRates = {
        labels: ['1D', '1W', '1M', '3M', '1Y'],
        datasets: [{
            label: 'Exchange Rate History',
            data: [0.84, 0.845, 0.83, 0.82, 0.85],
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    
    const rateChart = new Chart(
        document.getElementById('rateChart'),
        {
            type: 'line',
            data: historicalRates,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        }
    );
    
    
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        
        const rate = exchangeRates[fromCurrency][toCurrency];
        const convertedValue = amount * rate;
        
        
        convertedAmount.textContent = convertedValue.toFixed(2);
        conversionText.textContent = `${amount} ${fromCurrency} = ${convertedValue.toFixed(2)} ${toCurrency}`;
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        
        
        document.getElementById('detailRate').textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        document.getElementById('detailAmount').textContent = amount.toFixed(2);
        document.getElementById('detailFrom').textContent = fromCurrency;
        document.getElementById('detailTo').textContent = toCurrency;
        

        const newRates = historicalRates.datasets[0].data.map(val => val * (0.95 + Math.random() * 0.1));
        rateChart.data.datasets[0].data = newRates;
        rateChart.update();
        
        
        resultContainer.classList.remove('d-none');
    }
    
    function swapCurrencies() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        
        
        convertCurrency();
    }
    
    
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    
    detailsBtn.addEventListener('click', function() {
        detailsContainer.classList.toggle('d-none');
        detailsBtn.innerHTML = detailsContainer.classList.contains('d-none') ? 
            '<i class="fas fa-info-circle me-2"></i>View Details' : 
            '<i class="fas fa-times me-2"></i>Hide Details';
    });
    
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            fromCurrencySelect.value = this.dataset.from;
            toCurrencySelect.value = this.dataset.to;
        
            convertCurrency();
        });
    });
    
    
    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });
    
    
    convertCurrency();
});