import moment from 'moment'
export default{
    mounted(){
        let newDay = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
        let endDay = new Date();
        let $this = this;
        endDay.setDate(endDay.getDate() + 7);
        if (this.$i18n.locale === 'de') {
            while (newDay <= endDay) {
                moment.locale('de');
                this.generalDay.push({
                    day: moment(new Date(newDay)).format('dd'),
                    date: moment(new Date(newDay)).format('DD'),
                    selected: false
                });
                newDay.setDate(newDay.getDate() + 1);
            }
        }else{
            while (newDay <= endDay) {
                moment.locale('en');
                this.generalDay.push({
                    day: moment(new Date(newDay)).format('dd'),
                    date: moment(new Date(newDay)).format('DD'),
                    selected: false
                });
                newDay.setDate(newDay.getDate() + 1);
            }
        }
    },
}