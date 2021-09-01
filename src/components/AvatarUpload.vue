<template>
  <div class="example-avatar">
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>
    <div class="avatar-upload" v-show="!edit">
      <div class="text-center p-2">
        <img v-if="hasImageUrl" :src="imageUrl" class="rounded-circle" alt=""/>
        <v-icon v-else size="190" color="#eaeaea">mdi-account-circle</v-icon>
        <h5 class="pt-2">{{ tipsText }}</h5>
      </div>
      <div class="text-center p-2">
        <file-upload
            extensions="gif,jpg,jpeg,png,webp"
            accept="image/png,image/gif,image/jpeg,image/webp"
            name="avatar"
            class="btn btn-primary"
            :post-action="actionUrl"
            :drop="!edit"
            v-model="innerFiles"
            @input-filter="inputFilter"
            @input-file="inputFile"
            ref="upload"
        >
          <v-btn class="mt-1" small tile color="primary">
            {{ avatarText }}
          </v-btn>
        </file-upload>
      </div>
    </div>

    <div class="avatar-edit " v-show="innerFiles.length && edit">
      <div class="avatar-edit-image" v-if="innerFiles.length">
        <img ref="editImage" :src="innerFiles[0].url" alt=""/>
      </div>
      <div class="text-center p-4 mt-2">
        <v-btn class="mx-1" small tile @click.prevent="$refs.upload.clear">
          {{ cancelText }}
        </v-btn>
        <v-btn
            class="mx-1"
            small
            tile
            color="primary"
            @click.prevent="editSave"
        >
          {{ saveText }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script >
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import FileUpload from "vue-upload-component";

export default {
  components: {
    FileUpload,
  },
  props: {
    value: [String, Array],
    avatarText: {
      type: String,
      default: () => "上传",
    },
    tipsText: {
      type: String,
      default: () => "",
    },
    cancelText: {
      type: String,
      default: () => "取消",
    },
    saveText: {
      type: String,
      default: () => "确定",
    },
    actionUrl: String,
  },
  data() {
    return {
      isStringValue: false,
      innerFiles: [],
      edit: false,
      cropper: false,
    };
  },
  computed: {
    hasImageUrl() {
      return this.isStringValue ? this.value : this.innerFiles.length;
    },
    imageUrl() {
      return this.isStringValue ? this.value : this.innerFiles[0].url;
    },
  },
  watch: {
    edit(value) {
      if (value) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return;
          }
          this.cropper =  new Cropper(this.$refs.editImage, {
            aspectRatio: 1,
            viewMode: 1,
          });
        });
      } else {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = false;
        }
      }
    },
  },
  mounted() {
    this.isStringValue =
        !this.value || this.value === "" || typeof this.value == "string";
    if (!this.isStringValue) {
      this.innerFiles = this.value || [];
    }
  },
  methods: {
    //编辑完成进行保存
    editSave() {
      this.edit = false;
      let oldFile = this.innerFiles[0];
      let binStr = atob(
          this.cropper
              .getCroppedCanvas()
              .toDataURL(oldFile.type)
              .split(",")[1]
      );
      let arr = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      let file = new File([arr], oldFile.name, {type: oldFile.type});
      if (this.isStringValue) {
        this.getBase64Img(file).then((result) => {
          this.$emit("input", result);
        });
      }
      this.$refs.upload.update(oldFile.id, {
        file,
        type: file.type,
        size: file.size,
        active: true,
      });
    },
    alert(message) {
      alert(message);
    },
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true;
        });
      }
      if (!newFile && oldFile) {
        this.edit = false;
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.alert("Your choice is not a picture");
          return prevent();
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file);
        }
      }
    },
    /**
     * @desc 将base64转换为文件对象
     */
    base64toFile(base64code) {
      const arr = `${base64code}`.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `file.${mime.split("/")[1]}`, {type: mime});
    },
    getBase64Img(file) {
      function readFile(file, cb) {
        let FR = new FileReader();
        FR.readAsDataURL(file);
        FR.onloadend = () => {
          cb(FR.result);
        };
      }

      return new Promise((resolve) => {
        if (file) {
          readFile(file, resolve);
        }
      });
    },
  },
};
</script>
<style>
.example-avatar .avatar-upload .rounded-circle {
  width: 200px;
  height: 200px;
}

.example-avatar .text-center .btn {
  margin: 0 0.5rem;
}

.example-avatar .avatar-edit-image {
  max-width: 100%;
  max-height: 500px;
  z-index: 999;
}

.example-avatar .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}

.example-avatar .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
