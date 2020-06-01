//import * as moment from 'moment'
import * as R from 'ramda'
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default class Billings{
    constructor({data,projects}){
        
        this.data = data
        this.projects = projects

        this.startDate = projects.startDate
        this.startDate = R.curry((number) => R.map(item => {
                return { x: moment(R.prop(xParam, item)).format("MM/DD/YYYY"), y: R.prop(yParam, item) };
            }) //MAP
        ) //PLOTPARAMETERS
       
        this.filterByNumber = R.curry( number => R.filter(x => x.number == number))
        this.filterFee = R.filter(x => x.type == 'Fee')
        this.filterASR = R.filter(x => x.type == 'ASR')
        this.filterExpense = R.filter(x => x.type == 'Expense')
        this.filterDirectExpense = R.filter(x => x.status == 'Direct' && x.type == 'Expense')
        this.filterReimbursableExpense = R.filter(x => x.status == 'Reimbursable' && x.type == 'Expense')
        this.filterLabor = R.filter(x => x.type == 'Labor')
        this.filterInvoice = R.filter(x => x.type == 'Invoice')
        this.filterPaidInvoice = R.filter(x => x.status == 'Paid')
        this.filterUnpaidInvoice = R.filter(x => x.status != 'Paid' && x.type == 'Invoice')

        this.pickFields = R.curry( fields => R.map(R.pick([...fields])))

        this.plotParameters = R.curry((xParam, yParam) => R.map(item => {
                return { x: moment(R.prop(xParam, item)).format("MM/DD/YYYY"), y: R.prop(yParam, item) };
            }) //MAP
        ) //PLOTPARAMETERS

        this.getName = R.map(item => item.name)
        this.getMultiplier = R.map(item => item.multiplier)
        this.getAmountList = R.map(item => item.amount)

        this.getAmountByMonth = R.map(item => {
            return {x : item.date, y : item.amount}
        })
        this.getCummulativeAmountByMonth = R.map(item => {
            return {x : item.date, y : item.amount}
        })
        

        this.sortByName = R.sortBy(R.prop('name'))
        this.sortByNumber = R.sortBy(R.prop('number'))
        this.sortByDate = R.sortBy(R.prop('date'))

        this.pickNumber = R.map(R.pick(['number']))

        this.amount = R.prop('amount')
        this.number = R.prop('number')
        this.name = R.prop('name')
        this.getProp = R.curry(keyName => R.map(R.pluck(keyName)))

        this.count = R.length()
        this.total = R.sum()
        this.getLastItem = R.last()
        this.getFirstItem = R.head()
        this.uniq = R.uniq()
        this.uniqNumber = R.map(R.uniq(R.prop('number')))

    }//CONSTRUCTOR

    projectNameByNumber(number){
        return R.compose(this.getFirstItem, this.getName, this.filterByNumber(number))(this.projects)
    }

    projectMultiplierByNumber(number){
        return R.compose(this.getFirstItem, this.getMultiplier, this.filterByNumber(number))(this.projects)
    }

    projectStartDateByNumber(number){
        return R.compose(this.getFirstItem, R.pluck('start'), this.filterByNumber(number))(this.projects)
    }
    projectEndDateByNumber(number){
        return R.compose(this.getFirstItem, R.pluck('complete'), this.filterByNumber(number))(this.projects)
    }

    // feeByDuration(number){
    //     let startDate = this.projectStartDateByNumber(number)
    //     let endDate = this.projectEndDateByNumber(number)
    //     const range = moment.range(startDate, endDate)

    //     for (let month of range.by('month')) {
    //         console.log(month.format('YYYY-MM-DD'))
    //     }
    // }

    numberList(){
        return R.compose(this.uniq, this.pickNumber)(this.data)
    }

    // nameByNumber(number){
    //     return R.compose( this.getFirstItem, this.getName, this.filterByNumber(number))(this.data)
    // }

    totalFee(){
        return R.compose(this.total, this.getAmountList, this.filterFee)(this.data)
    }
    totalASR(){
        return R.compose(this.total, this.getAmountList, this.filterASR)(this.data)
    }
    totalExpense(){
        return R.compose(this.total, this.getAmountList, this.filterExpense)(this.data)
    }
    totalInvoice(){
        return R.compose(this.total, this.getAmountList, this.filterPaidInvoice, this.filterInvoice)(this.data)
    }
    totalAR(){
        return R.compose(this.total, this.getAmountList, this.filterUnpaidInvoice, this.filterInvoice)(this.data)
    }
    totalLabor(){
        return R.compose(this.amount, this.getLastItem, this.sortByDate, this.filterLabor)(this.data)
    }

    totalFeeByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterFee, this.filterByNumber(number))(this.data)
    }
    totalASRByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterASR, this.filterByNumber(number))(this.data)
    }
    totalExpenseByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterExpense, this.filterByNumber(number))(this.data)
    }
    totalDirectExpenseByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterDirectExpense, this.filterByNumber(number))(this.data)
    }
    totalReimbursableExpenseByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterReimbursableExpense, this.filterByNumber(number))(this.data)
    }
    totalARByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterUnpaidInvoice, this.filterByNumber(number))(this.data)
    }
    totalInvoiceByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterInvoice, this.filterByNumber(number))(this.data)
    }
    totalPaidInvoiceByNumber(number){
        return R.compose(this.total, this.getAmountList, this.filterPaidInvoice, this.filterByNumber(number))(this.data)
    }
    totalLaborByNumber(number){
        return R.compose(this.amount, this.getLastItem, this.sortByDate, this.filterLabor, this.filterByNumber(number))(this.data)
    }
    plotMUbyNumber(number){
        //return R.compose(this.getAmountByMonth,this.sortByDate, this.filterLabor, this.filterByNumber(number))(this.data)
        return R.compose(
            this.getAmountByMonth, 
            //R.tap(x => console.log('GET AMOUNT:',x)),
            this.sortByDate, 
            //R.tap(x => console.log('FILTER BY TYPE:',x)),
            this.filterInvoice, 
            //R.tap(x => console.log('FILTER BY NUMBER:',x)),
            this.filterByNumber(number)
        )(this.data)
    }
    plotLaborByNumber(number){
        return R.compose(this.plotParameters('date','amount'),this.sortByDate,this.filterLabor,this.filterByNumber(number))(this.data)
    }
    plotFeeByNumber(number){
        let s = this.projectStartDateByNumber(number)
        let e = this.projectEndDateByNumber(number)
        const fromDate = moment(s)
        const toDate   = moment(e)
        const range = moment.range(fromDate, toDate)
        const duration = Array.from(range.by('month'));
        const fee = this.totalFeeByNumber(number)
        let inc = fee/duration.length
        let amount = 0

        
        let plotArr = duration.map(m => {
            return {
                x : m.format('YYYY-MM-DD'),
                y : amount = amount + inc
            }
        })

        return plotArr
    }
    

    billingSummary(){
        let list = this.numberList()
        let arr = R.map(item => {
                let name = this.projectNameByNumber(item.number)
                let MU = this.projectMultiplierByNumber(item.number)
                let fee = this.totalFeeByNumber(item.number)
                let asr = this.totalASRByNumber(item.number)
                let expense = this.totalExpenseByNumber(item.number)
                let directExpense = this.totalDirectExpenseByNumber(item.number)
                let reimbursableExpense = this.totalReimbursableExpenseByNumber(item.number)
                let revenue = fee + asr + directExpense
                let labor = this.totalLaborByNumber(item.number)
                let invoice = this.totalInvoiceByNumber(item.number)
                let ar = this.totalARByNumber(item.number)
                let paid = this.totalPaidInvoiceByNumber(item.number)
                let percentInvoiced = invoice == 0 ? 0 : invoice/revenue
                let percentAR = invoice == 0 ? 0 : ar/invoice
                let percentLabor = labor == 0 ? 0 : labor/revenue
                let pendingLabor = fee + asr - directExpense - labor
                let wipProfit = invoice - labor
                let profit = revenue - labor
                let MUa = (paid/labor)*MU

                    return{
                        number : item.number,
                        name : name,
                        MU : MU,
                        MUa : MUa,
                        fee : fee,
                        asr : asr,
                        expense : expense,
                        directExpense : directExpense,
                        reimbursableExpense : reimbursableExpense,
                        revenue : revenue,
                        invoice : invoice,
                        paid : paid,
                        ar : ar,
                        labor : labor,
                        percentInvoiced : percentInvoiced,
                        percentAR : percentAR,
                        percentLabor : percentLabor,
                        pendingLabor : pendingLabor,
                        wipProfit : wipProfit,
                        profit : profit
                    }
                 },list)

        return this.sortByName(arr)
    }

    MU(multi){
        return this.totalInvoice() /this.totalLabor()*multi
    }

    

    
}//CLASS