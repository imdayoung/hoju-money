<template>
    <div class="container card my-5 report-container">
        <div class="title-container">
            <span class="font-brown fs-2 fw-bold">카테고리별 리포트</span>
            <div class="date-selector">
                <select id="year" v-model="selectedYear">
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
                <label for="year" class="font-brown fw-bold">년</label>
                <select id="month" v-model="selectedMonth">
                    <option v-for="month in availableMonths" :key="month" :value="month">{{ month }}</option>
                </select>
                <label for="month" class="font-brown fw-bold">월</label>
            </div>
        </div>
        <div class="chart-container">
            <canvas id="categoryChart"></canvas>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

export default {
    setup() {
        const chart = ref(null);
        const categories = ref({});
        const selectedYear = ref(new Date().getFullYear());
        const selectedMonth = ref(new Date().getMonth() + 1);
        const availableYears = ref(Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i));
        const availableMonths = ref(Array.from({ length: 12 }, (_, i) => i + 1));

        // Chart.js의 모든 요소를 등록
        Chart.register(...registerables);

        // 현재 달 데이터 필터링 함수
        const filterCurrentMonthData = (data) => {
            return data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getFullYear() === selectedYear.value && itemDate.getMonth() + 1 === selectedMonth.value && item.category_id >= 7 && item.category_id <= 13;
            });
        };

        // 카테고리별 데이터 그룹화 함수
        const groupByCategory = (data) => {
            return data.reduce((acc, item) => {
                acc[item.category_id] = (acc[item.category_id] || 0) + 1;
                return acc;
            }, {});
        };

        // 차트 생성 함수
        const createChart = (labels, counts) => {
                if (chart.value) {
                chart.value.destroy();
            }
            const ctx = document.getElementById('categoryChart').getContext('2d');
            chart.value = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels.map(id => categories.value[id]), // 실제 라벨 데이터
                    datasets: [{
                        data: counts,
                        backgroundColor: [
                            '#8898DA',
                            '#D992C9',
                            '#E2AEB1',
                            '#E2D1AB',
                            '#E6E7BC',
                            '#A8C46E',
                            '#B2BAC9',
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                        arc: {
                            borderWidth: 1
                        }
                    },
                    animation: {
                        duration: 0
                    },
                    plugins: {
                        legend: {
                            position: 'right', // 라벨을 도넛 오른쪽에 위치
                            labels: {
                                padding: 20 // 라벨의 내부 간격 설정
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
                                    const currentValue = context.dataset.data[context.dataIndex];
                                    const percentage = ((currentValue / total) * 100).toFixed(2);
                                    return ` ${percentage}%`;
                                }
                            }
                        }
                    }
                }
            });
            
        };

        const fetchData = async () => {
            try {
                const [comesResponse, categoriesResponse] = await Promise.all([
                    axios.get('http://localhost:3001/comes'),
                    axios.get('http://localhost:3001/categories')
                ]);
                const comesData = comesResponse.data;
                const categoriesData = categoriesResponse.data;

                // 데이터 필터링 및 그룹화
                const filteredData = filterCurrentMonthData(comesData);
                const categoryCounts = groupByCategory(filteredData);

                // 차트 데이터 준비
                const labels = Object.keys(categoryCounts);
                const counts = Object.values(categoryCounts);

                // category 데이터 매핑
                categories.value = categoriesData.reduce((acc, category) => {
                    acc[category.id] = category.typename;
                    return acc;
                }, {});

                // 차트 생성
                createChart(labels, counts);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        };

        watch([selectedYear, selectedMonth], fetchData);

        onMounted(() => {
            fetchData();
        });

        return {
            selectedYear,
            selectedMonth,
            availableYears,
            availableMonths,
            currentYear: selectedYear,
            currentMonth: selectedMonth,
        };
    }
};
</script>

<style scoped>
.font-brown {
  color: #4D2A30;
}

.report-container {
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 0px
}

.title-container {
    margin: 20px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.date-selector {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.date-selector label {
    margin-right: 5px;
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    margin: 10px 10px 40px 10px;
}
</style>
