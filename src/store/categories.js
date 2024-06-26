//스토어를 만든다.
import { defineStore } from 'pinia';
import axios from 'axios';

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categoryList: []
    }),
    actions: {
        getCategoryList() {
            axios.get('http://localhost:3001/categories')
                .then((res) => {
                    // 성공 핸들링
                    console.log(this.categoryList)
                    this.categoryList = res.data;
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        },
        getIncomeCategoryList() {
            axios.get('http://localhost:3001/categories?type=1')
                .then((res) => {
                    // 성공 핸들링
                    console.log(res.data);
                    this.categoryList = res.data;
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        },
        getOutcomeCategoryList() {
            axios.get('http://localhost:3001/categories?type=2')
                .then((res) => {
                    // 성공 핸들링
                    console.log(res.data);
                    this.categoryList = res.data;
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        }
    }
});