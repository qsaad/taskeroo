import * as R from 'ramda'
import * as moment from 'moment'

export default class RFIS{
    constructor(data){
       
        this.data = data

        this.filterPending = R.filter(x => x.action == 'Review Pending')
       
        this.filterByAction = R.curry( action => R.filter(x => x.action == action))
        this.filterByUser = R.curry( name => R.filter(x => x.by == name))
        this.filterByNumber = R.curry( number => R.filter(x => x.number == number))
        this.filterByDiscipline = R.curry( discipline => R.filter(x => x.discipline[0] == discipline))

        this.pickFields = R.curry( fields => R.map(R.pick([...fields])))
     
        this.sortByReceive = R.sortBy(R.prop('receive'))

        this.count = R.length()
        this.total = R.sum()
        this.getLastItem = R.last()

    }//CONSTRUCTOR

   
    // +++++++++++++++++++++++++++++++++++++++++
    //PENDING
    // +++++++++++++++++++++++++++++++++++++++++
    pending(fields){
        return R.compose(
            this.sortByReceive, 
            this.pickFields(fields), 
            this.filterPending, 
            )(this.data)
    }//WORKING

    pendingByDiscipline(discipline,fields){
        return R.compose(
            this.sortByReceive, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByDiscipline(discipline), 
            )(this.data)
    }//WORKING

    pendingByNumber(number, fields){
        return R.compose(
            this.sortByReceive, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByNumber(number)
            )(this.data)
    }//WORKING

    pendingByUser(name,fields){
        return R.compose(
            this.sortByReceive, 
            this.pickFields(fields), 
            this.filterPending, 
            this.filterByUser(name)
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

    totalByNumberPerDiscipline(number, discipline){
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

    totalByNumberPerAction(number, action){
        return R.compose(
            this.count, 
            this.filterByAction(action),
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