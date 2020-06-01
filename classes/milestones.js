import * as R from 'ramda'
import * as moment from 'moment'

export default class Milestones{
    constructor(data){
        this.data = data

        this.filterPending = R.filter(x => x.submitted == false)
        this.filterOverdue = R.filter(x => moment(x.date) < moment())
        this.filterdueIn10Days = R.filter(x => moment(x.date) < moment().add(10,'days'))
        this.filterByNumber = R.curry( number => R.filter(x => x.number == number))
        this.filterByDiscipline = R.curry( discipline => R.filter(x => x.discipline[0] == discipline))

        this.pickFields = R.curry( fields => R.map(R.pick([...fields])))
     
        this.sortByDate = R.sortBy(R.prop('date'))

        this.count = R.length()
        this.total = R.sum()
        this.getLastItem = R.last()

    }//CONSTRUCTOR

    // +++++++++++++++++++++++++++++++++++++++++
    //OVERDUE
    // +++++++++++++++++++++++++++++++++++++++++
    overdueByDiscipline(discipline,fields){
        return R.compose(
            this.sortByDate, 
            this.pickFields(fields), 
            this.filterPending,
            this.filterOverdue, 
            this.filterByDiscipline(discipline),
            )(this.data)
    }//WORKING

    overdueByNumber(number,fields){
        return R.compose(
            this.sortByDate, 
            this.pickFields(fields), 
            this.filterPending,
            this.filterOverdue, 
            this.filterByNumber(number),
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //PENDING
    // +++++++++++++++++++++++++++++++++++++++++
    pending(fields){
        return R.compose(
            this.sortByDate, 
            this.pickFields(fields), 
            this.filterPending, 
            )(this.data)
    }//WORKING

    pendingByDiscipline(discipline,fields){
        return R.compose(
            this.sortByDate, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByDiscipline(discipline), 
            )(this.data)
    }//WORKING

    pendingByNumber(number, fields){
        return R.compose(
            this.sortByDate, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByNumber(number)
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //DUE
    // +++++++++++++++++++++++++++++++++++++++++
    dueIn10Days(fields){
        return R.compose(
            this.sortByDate, 
            this.pickFields(fields), 
            this.filterPending,
            this.filterdueIn10Days
            )(this.data)
    }//WORKING

    dueIn10DaysByDiscipline(discipline, fields){
        return R.compose(
            this.sortByDate, 
            this.pickFields(fields), 
            this.filterPending,
            this.filterdueIn10Days,
            this.filterByDiscipline(discipline),
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //COUNT - TOTAL
    // +++++++++++++++++++++++++++++++++++++++++
    totalByDiscipline(discipline){
        return R.compose(
            this.count, 
            this.filterByDiscipline(discipline),
            )(this.data)
    }//WORKING

    totalByNumber(number){
        return R.compose(
            this.count, 
            this.filterByNumber(number)
            )(this.data)
    }//WORKING

    totalByNumberPerDiscipline(number,discipline){
        return R.compose(
            this.count, 
            this.filterByDiscipline(discipline), 
            this.filterByNumber(number)
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //COUNT - OVERDUE
    // +++++++++++++++++++++++++++++++++++++++++
    overdueByDisciplineCount(discipline){
        return R.compose(
            this.count, 
            this.filterPending,
            this.filterOverdue, 
            this.filterByDiscipline(discipline),
            )(this.data)
    }//WORKING

    overdueByNumberCount(number){
        return R.compose(
            this.count, 
            this.filterPending,
            this.filterOverdue, 
            this.filterByNumber(number)
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //COUNT - PENDING
    // +++++++++++++++++++++++++++++++++++++++++
    pendingByDisciplineCount(discipline){
        return R.compose(
            this.count,  
            this.filterPending, 
            this.filterByDiscipline(discipline),
            )(this.data)
    }//WORKING

}//CLASS