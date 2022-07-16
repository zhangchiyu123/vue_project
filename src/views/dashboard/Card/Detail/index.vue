<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg
        t="1652497207395"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1446"
        width="16"
        height="16"
      >
        <path
          d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m40.96 757.76c0 22.528-18.432 40.96-40.96 40.96s-40.96-18.432-40.96-40.96V430.08c0-22.528 18.432-40.96 40.96-40.96s40.96 18.432 40.96 40.96v327.68z m-40.96-409.6c-33.792 0-61.44-27.648-61.44-61.44s27.648-61.44 61.44-61.44 61.44 27.648 61.44 61.44-27.648 61.44-61.44 61.44z"
          p-id="1447"
          fill="#dbdbdb"
        ></path>
      </svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["title", "count"],
};
</script>

<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.card-content {
  font-size: 30px;
  font-weight: 500;
  padding: 10px;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
}
</style>