<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <h3>Post your image</h3>
            <hr>
            <form @submit.prevent="addMessage" class="mb-4 text-left">
                <div v-if="error">
                    <h4 class="alert-heading">Error!</h4>
                    <p>{{ error }}</p>
                </div>
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" v-model="message.username" class="form-control" required>
                </div>
                <div class="form-group">
                    <label></label>
                    <label>Subject</label>
                    <input type="text" v-model="message.subject" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea v-model="message.message" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="url" v-model="message.imageURL" class="form-control" placeholder="Enter URL to an image">
                </div>
                <button type="submit" class="btn btn-primary btn-rounded">Add Message</button>
            </form>
            <div v-for="(message, index) in messages" :key="`key-${index}`">
                <div class="text-left mb-2">
                    <h4>User: {{ message.username }}</h4>
                    <h5>Subject: {{ message.subject }}</h5>
                    <p>Message: {{ message.message }}</p>
                    <small>Posted at: {{ formatTime(message.created) }}</small>
                </div>
                <img v-if="message.imageURL" :src="message.imageURL" :alt="message.subject" class="img-fluid"
                style="max-width: 100%;">
                <p class="text-right mt-2"><button class="btn btn-danger btn-rounded"
                @click="deleteMessage(message._id, index)">Delete</button></p>
                <hr>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
const  API_URL = "http://localhost:8000/messages"
export default {
    data: function () {
        return {
            error: "",
            messages: [],
            message: {
                username: "Enter a user name",
                subject: "",
                message: "",
                imageURL: ""
            }
        }
    },
    methods: {
        formatTime: function (time) {
            return moment(time).format("dddd, MMMM Do YYYY, h:mm:ss a")
        },
        addMessage: function () {
            console.log(this.message)
            fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(this.message),
                headers: {
                "content-type": "application/json"
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.details) {
                    // there was an error...
                    const error = result.details
                    .map(detail => detail.message)
                    .join(". ");
                    this.error = error;
                } else {
                    this.error = "";
                    this.showMessageForm = false;
                    this.messages.push(result);
                }
            });
        },
        deleteMessage: function (id, index) {
            console.log(id)
            fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            }).then(response => response.json())
            .then(result => {
                if (result.error) {
                    this.error = result.error
                } else {
                    this.messages.splice(index, 1)
                    console.log(result.message)
                }
            })
        }
    },
    mounted: function () {
        let vm = this;
        fetch(API_URL).then(res => {
            return res.json()
        }).then(result => {
            vm.messages = result
        })
    }
}
</script>