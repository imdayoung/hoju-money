<template>
    <div>
        <h2>지출</h2>
        <label for="datepicker">날짜</label>
        <datepicker 
            v-model="outcome.date"
            input-class="form-control">
        </datepicker>

        금액 <br/>
        <input type="text" v-model.number="outcome.money"> <br/>

        카테고리 <br/>
        <div class="category">
            <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
                {{selectedCategoryName}}
            </button>
            <ul class="dropdown-menu">
                <li v-for="category in filteredCategories" :key="category.id">
                    <a class="dropdown-item" href="#" @click="selectCategory(category.id, category.typename)">{{ category.typename }}</a>
                </li>
            </ul>
        </div>

        결제수단 <br/>
        <div class="method">
            <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
                {{selectedMethodName}}
            </button>
            <ul class="dropdown-menu">
                <li v-for="method in methods" :key="method">
                    <a class="dropdown-item" href="#" @click="selectMethod(method)">{{ method }}</a>
                </li>
            </ul>
        </div>

        내역 <br/>
        <input type="text" v-model="outcome.title"> <br/>

        메모 <br/>
        <input type="text" v-model="outcome.memo"> <br/>

        <button type="button" class="btn btn-dark" @click="submitForm">저장</button>
        <button type="button" class="btn btn-dark" @click="resetForm">취소</button>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Datepicker from 'vue3-datepicker';
import useTransactionStore from '../../store/transaction.js';

export default {
    name: "OutcomeCreate",
    components: {
        Datepicker
    },
    setup() {
        const store = useTransactionStore();

        const outcome = ref({
            users_id: 1,
            type: 2,
            title: '',
            category_id: 0,
            money: 0,
            method: '',
            memo: '',
            date: ''
        });
        
        //드롭다운 항목 선택 시 선택한 항목을 보여주기 위해
        const selectedCategoryName = ref('지출 카테고리 선택');
        const selectedMethodName = ref('결제수단 선택');

        onMounted(() => {
            store.fetchData();
        });

        const categories = computed(() => store.categorys);
        //지출에 해당하는 카테고리만 필터링해서 출력
        const filteredCategories = computed(() => {
            if (Array.isArray(categories.value)) {
                return categories.value.filter(category => category.type == 2);
            }
            return [];
        });
        //결제수단을 선택할 수 있는 항목
        const methods = ref(['mastercard', 'visa', 'americanexpress']);

        //카테고리
        const selectCategory = (id, name) => {
            outcome.value.category_id = id;
            selectedCategoryName.value = name;
        };

        //결제수단 선택
        const selectMethod = (method) => {
            outcome.value.method = method;
            selectedMethodName.value = method;
        };

        //트랜젝션 저장 
        const submitForm = async () => {
            await store.createCome(outcome.value);
            resetForm(); //후에 데이터 생성을 위해 폼비우기
        };

        //취소 버튼 (폼 비우기)
        const resetForm = () => {
            outcome.value = {
                users_id: 1,
                type: 2,
                title: '',
                category_id: 0,
                money: 0,
                method: '',
                memo: '',
                date: ''
            };
            selectedCategoryName.value = '수입 카테고리 선택';
            selectedMethodName.value = '결제 수단 선택';
        };

        return {
            outcome, categories, filteredCategories, methods, selectCategory, selectMethod, submitForm, resetForm, selectedCategoryName, selectedMethodName
        };
    },
};
</script>

<style scoped>
.form-control {
    width: 200px;
    padding: 5px;
}
</style>