
import {split, truncate, map, filter} from "lodash"

export const metrics =  {
    data(){
        return{
            roleList :['PM','EOR','ADMIN','PIC','ENG','CAD'],
            rfisActionList :['Review Pending','Clarification','Error','Omission','GC Error','GC Omission','GC Substitution','Site Condition'],
            billingsTypeList :['Fee','Expense','ASR','Labor','Invoice'],
            billingsStatusList :['Approved','Pending','Issued','Paid'],
            billingsASRStatusList :['Approved','Pending'],
            billingsInvoiceStatusList :['Issued','Paid'],
            billingsExpenseStatusList :['Reimbursable','Direct'],
            submittalsActionList :['Review Pending','No Exception','Furnish as Noted','Revise and Resubmit','Reviewed Only'],
            stateList : ['CA','OH','FL'],
            marketList : ['Commercial','Retail','Industrial','Institutional','Recreational','Public']
        }
    },//DATA
    computed:{
        usersCount(){
          return this.$store.getters['count']
        },
        usersList(){
            return map(this.$store.getters['users'], item =>{
                return item.fname + ' ' + item.lname
            })
        },
        groupsList(){
          return map(this.$store.getters['groups'], item =>{
            return item
          })
        }
    },//COMPUTED
    methods:{
        userInitials(name){
            // let nameArr = name.split(" ")
            // let fname = nameArr[0]
            // let lname = nameArr[1]
            // return fname.substring(0, 1) + lname.substring(0, 1)

            let nameArr = split(name, " ")
            return map(nameArr, x =>{
              return x.charAt(0)
            }).join('')
        },
        joinDisciplines(disciplinesArr){
           return _.join(disciplinesArr,'')
        },
        utilization(numerator, denominator){
          return ((numerator/denominator)*100).toFixed(0) + ' %'
        },
        formatDate(date) {
          if (!date) return null

          const [year, month, day] = date.split('-')
          return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year.substr(2,2)}`
          // let mm = _.pad(month,2,'0')
          // let dd = _.pad(day,2,'0')
          // let yy = year.substr(2,2)

          //return `${mm}/${dd}/${yy}`
          //return `${_.pad(month,2,'0')}/${_.pad(day,2,'0')}/${year.substring(2,2)}`
        },
        formatAmount(amount){
          let formatter = new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'})
          return formatter.format(amount)

          //return '$' +  Intl.NumberFormat().format(amount)
        },
        formatPercent(number){
          return (number*100).toFixed(0) + '%'
        },
        formatNumber(value,decimal){
          return Number(value).toFixed(decimal)
        },
        formatRfiNumber(number) {
          if (!number) return null

          //return number.padStart(3, '0')
          return _.pad(number,2,'0')
        },
    }//METHODS
}//EXPORT