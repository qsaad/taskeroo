import * as R from 'ramda'
import * as moment from 'moment'

export default class Submittals{
    constructor(data){
       
        this.data = data

        this.filterPending = R.filter(x => x.action == 'Review Pending')
        this.filterOverdue = R.filter(x => moment(x.due) < moment())
        this.filterdueIn10Days = R.filter(x => moment(x.due) < moment().add(10,'days'))
        this.filterByUser = R.curry( name => R.filter(x => x.by == name))
        this.filterByNumber = R.curry( number => R.filter(x => x.number == number))
        this.filterByDiscipline = R.curry( discipline => R.filter(x => x.discipline[0] == discipline))

        this.pickFields = R.curry( fields => R.map(R.pick([...fields])))
     
        this.sortByDue = R.sortBy(R.prop('due'))

        this.count = R.length()
        this.total = R.sum()
        this.getLastItem = R.last()

    }//CONSTRUCTOR

    // +++++++++++++++++++++++++++++++++++++++++
    //OVERDUE
    // +++++++++++++++++++++++++++++++++++++++++
    overdue(fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterOverdue, 
            this.filterPending
            )(this.data)
    }//WORKING

    overdueByDiscipline(discipline,fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterOverdue, 
            this.filterPending,
            this.filterByDiscipline(discipline),
            )(this.data)
    }//WORKING

    overdueByNumber(number,fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterOverdue, 
            this.filterPending,
            this.filterByNumber(number),
            )(this.data)
    }//WORKING

    overdueByUser(name,fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterOverdue, 
            this.filterPending, 
            this.filterByUser(name)
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //PENDING
    // +++++++++++++++++++++++++++++++++++++++++
    pending(fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterPending, 
            )(this.data)
    }//WORKING

    pendingByDiscipline(discipline,fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByDiscipline(discipline), 
            )(this.data)
    }//WORKING

    pendingByNumber(number, fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByNumber(number)
            )(this.data)
    }//WORKING

    pendingByUser(name,fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByUser(name)
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //DUE
    // +++++++++++++++++++++++++++++++++++++++++
    dueIn10Days(fields){
        return R.compose(
            this.sortByDue, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterdueIn10Days
            )(this.data)
    }//WORKING

    dueIn10DaysByDiscipline(discipline, fields){
        return R.compose(
            this.sortByDue, 
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

    totalByUser(name){
        return R.compose(
            this.count, 
            this.filterByUser(name)
            )(this.data)
    }//WORKING

    // +++++++++++++++++++++++++++++++++++++++++
    //COUNT - OVERDUE
    // +++++++++++++++++++++++++++++++++++++++++
    overdueByDisciplineCount(discipline){
        return R.compose(
            this.count, 
            this.filterOverdue, 
            this.filterPending, 
            this.filterByDiscipline(discipline),
            )(this.data)
    }//WORKING

    overdueByNumberCount(number){
        return R.compose(
            this.count, 
            this.filterOverdue, 
            this.filterPending, 
            this.filterByNumber(number)
            )(this.data)
    }//WORKING

    overdueByUserCount(name){
        return R.compose(
            this.count, 
            this.filterOverdue, 
            this.filterPending, 
            this.filterByUser(name)
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