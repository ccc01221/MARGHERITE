<template>
  <div class="selector">
    <div class="selector-search">
      <input
        @keyup.enter="focusOut"
        v-model="filterText"
        :placeholder="this.$t('booksPage.search')"
        type="text"
        ref="searchSelector"
      />
      <span class="searchbutton">
        <i class="fal fa-search"></i>
      </span>
    </div>

    <div class="selector-holder">
      <div v-for="element in filteredElements">
        <input
          v-model="element.active"
          type="checkbox"
          :id="category+'-'+element.index"
          :name="element.index"
          @change="handleChange($event)"
        />
        <label :for="category+'-'+element.index">
          <span>{{element.name}}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Selector",
  props: {
    options: {
      type: Array,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    codeChecks: [],
    filterText: ""
  }),

  created() {
    let codesAvail = [];
    for (var k = 0; k < this.value.length; k++) {
      codesAvail.push(this.value[k].code);
    }

    for (var i = 0; i < this.options.length; i++) {
      this.codeChecks.push({
        active: codesAvail.indexOf(this.options[i].code) >= 0,
        code: this.options[i].code,
        name: this.options[i].name,
        index: i
      });
    }
    /*
    this.$emit(
      "input",
      this.value.concat({
        code: this.codeChecks[0].code,
        name: this.codeChecks[0].name
      })
    );*/
    //this.$emit("remove", mymodel, 0);
  },
  destroyed() {},
  computed: {
    filteredElements() {
      return this.codeChecks.filter(element => {
        return element.name.match(new RegExp(this.filterText, "i"));
      });
    },
    margin: function() {
      return 0; //this.mymargin;
    }
  },
  watch: {
    value: function(value) {
      let codesAvail = [];
      for (var k = 0; k < value.length; k++) {
        codesAvail["" + value[k].code] = k;
      }
      for (var k = this.codeChecks.length - 1; k >= 0; k--) {
        if (codesAvail["" + this.codeChecks[k].code] != undefined) {
          this.codeChecks[k].active = true;
        } else {
          this.codeChecks[k].active = false;
        }
      }
    }
  },
  methods: {
    focusOut: function() {
      this.$refs.searchSelector.focus();
      setTimeout(() => {
        this.$refs.searchSelector.blur();
      }, 50);
    },
    clear: function() {
      this.value = [];
      for (var i = 0; i < this.codeChecks.length; i++) {
        this.codeChecks[i].active = false;
      }
      this.$emit("input", this.value);
    },
    handleChange: function(e) {
      const name = Number(e.target.name);
      let codesAvail = [];
      for (var k = 0; k < this.value.length; k++) {
        codesAvail["" + this.value[k].code] = k;
      }
      if (!this.codeChecks[name].active) {
        if (codesAvail["" + this.codeChecks[name].code] != undefined) {
          this.value.splice(codesAvail["" + this.codeChecks[name].code], 1);
          this.$emit("input", this.value);
        }
      } else {
        if (codesAvail["" + this.codeChecks[name].code] == undefined) {
          this.$emit(
            "input",
            this.value.concat({
              code: this.codeChecks[name].code,
              name: this.codeChecks[name].name
            })
          );
        }
      }
      this.$forceUpdate();
      console.log("name:" + name);
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
@import "../../styles/components/selector/selector";
</style>
