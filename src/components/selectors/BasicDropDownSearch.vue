<template>
  <div class="dropdown">
    <input
      class="dropdown-input"
      :name="name"
      id="inputfield"
      @focus="showOptions()"
      @blur="exit()"
      @keyup.enter="keyMonitor"
      v-model="searchFilter"
      :disabled="disabled"
      :placeholder="placeholder"
      autocomplete="false"
    />
    <span class="searchbutton" @click="keyMonitor">
      <i class="fal fa-search"></i>
    </span>

    <div class="dropdown-content" v-show="optionsShown">
      <div
        class="dropdown-item"
        @mousedown="selectOption(option)"
        v-for="(option, index) in filteredOptions"
        :key="index"
      >{{option.name || option.code || '-'}}</div>
    </div>
  </div>
</template><script>
export default {
  name: "BasicDropDownSearch",
  props: {
    name: {
      type: String,
      required: false,
      default: "dropdown",
      note: "Input name"
    },
    options: {
      type: Array,
      required: true,
      default: [],
      note: "Options of dropdown. An array of options with id and name"
    },
    placeholder: {
      type: String,
      required: false,
      default: "Please select an option",
      note: "Placeholder of dropdown"
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
      note: "Disable the dropdown"
    },
    maxItem: {
      type: Number,
      required: false,
      default: 6,
      note: "Max items showing"
    }
  },
  data() {
    return {
      selected: {},
      optionsShown: false,
      searchFilter: "",
      hasfocus: false
    };
  },
  created() {
    //this.$emit("selected", this.selected);
    this.optionsShown = false;
  },
  computed: {
    filteredOptions() {
      const filtered = [];
      const regOption = new RegExp(this.searchFilter, "ig");
      for (const option of this.options) {
        if (this.searchFilter.length < 1 || option.name.match(regOption)) {
          if (filtered.length < this.maxItem) filtered.push(option);
        }
      }
      if (filtered.length == 0) {
        this.optionsShown = false;
      } else {
        if (document.getElementById("inputfield") === document.activeElement) {
          this.optionsShown = true;
        }
      }
      return filtered;
    }
  },
  methods: {
    selectOption(option) {
      this.selected = option;
      this.optionsShown = false;
      this.searchFilter = this.selected.name;
      this.$emit("selected", this.selected.name);
    },
    showOptions() {
      if (!this.disabled) {
        this.optionsShown = true;
        hasfocus = true;
      }
    },
    exit() {
      if (!this.selected.id) {
        this.selected = {};
      } else {
        this.searchFilter = this.selected.name;
      }
      //this.$emit("selected", this.selected);
      this.optionsShown = false;
      hasfocus = false;
    }, // Selecting when pressing Enter
    keyMonitor: function(event) {
      this.$emit("selected", this.searchFilter + " ");
    }
  },
  watch: {
    searchFilter() {
      if (this.filteredOptions.length === 0) {
        this.selected = {};
      } else {
        this.selected = this.filteredOptions[0];
      }
      this.$emit("filter", this.searchFilter);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/components/selector/basicDropDownSearch";
</style>;
