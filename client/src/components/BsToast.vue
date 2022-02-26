<template>
    <div ref="el" class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                <strong class="me-auto">{{title}} - </strong>{{message}}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'bootstrap';

export default {
    name: 'Toast',
    data: () => ({
        toast:      {},
        title:      '',
        message:    '',
        shown:       false
    }),
    mounted() {
        this.toast = new Toast(this.$refs.el);
    },
    methods: {
        show(title, message) {
            this.title = title;
            this.message = message;
            this.toast.show();
        }
    }
}
</script>