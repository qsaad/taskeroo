import * as R from 'ramda'
import * as moment from 'moment'
import {map, orderBy, groupBy, sum, range, filter} from "lodash"

export default class Backlog{
    constructor(data){
       
        this.data = data
        this.modifiedData = this.expandData()

        this.filterGroup = R.filter(x => x.group == 'OEC-S-COL')

        this.filterByName = R.curry(val => R.filter(x => x.name == val))
        this.filterByWeekNo = R.curry(val => R.filter(x => x.weekNo == val))
        this.filterByTo = R.curry(val => R.filter(x => x.to == val))
        this.filterByEnd = R.curry( val => R.filter(x => x.end == val))
        this.filterByName = R.curry( val => R.filter(x => x.name == val))
        this.filterByHours = R.curry( val => R.filter(x => x.hours == val))
        this.filterCompleted = R.filter(x => x.completed === true)
        this.filterPending = R.filter(x => x.completed === false)
        this.filterBillable = R.filter(x => x.billable === true)
        this.filterUnbillable = R.filter(x => x.billable === false)
       
        this.filterBetweenDates = R.curry((start, end) =>R.filter(x => x.end >= start && x.end <= end))

        this.groupByWeekNo = R.groupWith((a,b) => a.weekNo === b.weekNo)
        this.groupByTo = R.groupWith((a,b) => a.to === b.to)
        this.groupByName = R.groupWith((a,b) => a.name === b.name)
        this.groupByNumber = R.groupWith((a,b) => a.number === b.number)
        this.groupByCompleted = R.groupWith((a,b) => a.completed === b.completed)
        this.groupByBillable = R.groupWith((a,b) => a.billable === b.billable)
        this.groupByEndDate = R.groupWith((a, b) => a.end === b.end)

        this.groupByDayOfWeek = R.groupBy((item) => {
            let index = moment(item.end).day()
            return index == 1 ? 'Monday' :
                   index == 2 ? 'Tuesday' :
                   index == 3 ? 'Wednesday' :
                   index == 4 ? 'Thursday' : 'Friday';
        })

        this.getKeys = R.keys()
		this.getFirstData = R.head()

        this.pluckByKey = R.curry(key => R.pluck(key))
        this.pickFields = R.curry( fields => R.map(R.pick([...fields])))
       
        this.sortByStart = R.sortBy(R.prop('start'))
        this.sortByEnd = R.sortBy(R.prop('end'))
        this.sortByWeekNo = R.sortBy(R.prop('weekNo'))
        this.sortByName = R.sortBy(R.prop('name'))
        this.sortByTo = R.sortBy(R.prop('to'))
        this.sortByDescription = R.sortBy(R.prop('description'))

        this.count = R.length()

        this.sumHours = (data => {
            //LOOP THRU WEEK LIST
            let result = R.map(items =>{
                //LOOP THRU ITEMS OF EACH WEEK
                const sumHours = x => {
                    //CREATE ARRAY OF HOURS FOR EACH WEEK
                    let arr = []
                    arr.push(R.map(item => (item.hours).toFixed(0),x))
                    //RETURN SUM OF HOURS ARRAY
                    return R.sum(arr[0])
                }
                return {
                    weekNo : moment().week(items[0].weekNo).subtract(2,'day').format("MM-DD"),
                    //weekNo : moment().week(items[0].weekNo).subtract(4, 'days').format("YYYY-MM-DD"),
                    //weekNo : items[0].weekNo,
                    hours : sumHours(items),
                    utilization : (sumHours(items)/40*100).toFixed(0)+"%"
                }
            },data)

            return result
        })
       
        this.total = R.sum()
        this.getLastItem = R.last()
        this.take4 = R.take(4)
        this.takeAny = R.curry(x => R.take(x))

    }//CONSTRUCTOR

    //-----------------------------------------//
    //OPERATION FUNCTION
    //-----------------------------------------//

    GetDataKeys(data){
		return R.compose(this.getKeys,this.getFirstData)(data)
    }
    
    weekDays(start,end){
		// 0 = Sunday, 1 = Monday ....
		let noDays = moment(end).diff(start,'days') + 1
		let arr = []
		_.forEach(_.range(noDays), i => {
			let dayOfWeek = moment(start).add(i, 'day').day()
			if(dayOfWeek != 0 && dayOfWeek != 6){
				arr.push(moment(start).add(i, 'day').format('YYYY-MM-DD'))
			}
		})
		return {
			list : arr,
			duration : arr.length
		}
    }

    currentWeekRange(){
        let currentWeekNo = moment().week()
        let weekDayIndex = moment().day()
        let start = ''
        let end = ''
        
        switch(weekDayIndex) {
            //SUNDAY
            case 0:
                start = moment().week(currentWeekNo).add(1,'day').format('YYYY-MM-DD')
                break
            //MONDAY
            case 1:
                start = moment().week(currentWeekNo).add(0,'day').format('YYYY-MM-DD')
                break
            //TUESDAY
            case 2:
                start = moment().week(currentWeekNo).subtract(1,'day').format('YYYY-MM-DD')
                break
            //WEDNESDAY
            case 3:
                start = moment().week(currentWeekNo).subtract(2,'day').format('YYYY-MM-DD')
                break
            //THHURSDAY
            case 4:
                start = moment().week(currentWeekNo).subtract(3,'day').format('YYYY-MM-DD')
                break
            //FIRDAY
            case 5:
                start = moment().week(currentWeekNo).subtract(4,'day').format('YYYY-MM-DD')
                break
            //SATURDAY
            case 6:
                start = moment().week(currentWeekNo).add(2,'day').format('YYYY-MM-DD')
                break
        }

        end = moment(start).add(4,'day').format('YYYY-MM-DD')

        return {start, end}
    }

    expandData(){
        let rawArr = []

        //map(orderBy(this.data,'end'), x =>{
        map(orderBy(filter(this.data,{'completed':false}),'end'), x =>{
                let today = moment().format('YYYY-MM-DD')
                let startWeekNo = x.start == '' ? moment(today).week() : moment(x.start).week()
                let endWeekNo = moment(x.end).week()
                let duration = 0
                let hoursPerWeek = 0

                if(startWeekNo > endWeekNo){
                    duration = (52 - startWeekNo) + endWeekNo + 1
                    //duration = (52 - startWeekNo) + endWeekNo
                    hoursPerWeek = x.hours/duration
                    
                }
                if(startWeekNo == endWeekNo){
                    duration = 1
                    hoursPerWeek = x.hours/duration
                }
                if(startWeekNo < endWeekNo){
                    duration = endWeekNo - startWeekNo + 1
                    //duration = endWeekNo - startWeekNo
                    hoursPerWeek = x.hours/duration
                }

                map(range(duration), item =>{
                    rawArr.push({
                        to : x.to,
                        weekNo : startWeekNo + item > 52 ? duration - item : startWeekNo + item,
                        //weekNo : startWeekNo + item >= 52 ? 1 + item : startWeekNo + item,
                        hours : hoursPerWeek,
                        name : x.name,
                        number : x.number,
                        description : x.description,
                        billable : x.billable,
                        completed : x.completed
                    })
                })

                // return {
                //     startWeekNo : startWeekNo,
                //     weekNo : moment(x.end).week(),
                //     duration : duration,
                //     range : range(1,duration+1),
                //     hoursPerWeek : hoursPerWeek,
                //     hours : x.hours,
                //     to : x.to
                // }
            })

            return rawArr
    }

    //-----------------------------------------//
    //OUTPUT DISPLAY FUNCTIONS
    //-----------------------------------------//

    UserTotalBillableHours(user){
        return R.compose(
            this.total,
            this.pluckByKey('hours'),
            this.filterByTo(user),
            this.filterBillable
        )(this.data)
      }

    UserTotalUnbillableHours(user){
        return R.compose(
            this.total,
            this.pluckByKey('hours'),
            this.filterByTo(user),
            this.filterUnbillable
        )(this.data)
      }
      
    TotalHoursBetweenDates(startDate, endDate){
        return R.compose(
            this.pluckByKey('hours'),
            this.filterBetweenDates(startDate, endDate)
        )(this.data)
      }
      
    UserHoursBetweenDates(startDate, endDate, user){
        return R.compose(this.total, 
            this.pluckByKey('hours'), 
            this.filterBetweenDates(startDate, endDate), 
            this.filterByTo(user), this.filterPending
        )(this.data)
    }

    PlotAverageUtilizationPerWeek(noWeeks, noMembers){
        let data = this.TotalHoursPerWeek(noWeeks)
        let arr = []

        R.forEach((item) =>{ 
            arr.push({
                    x : item.weekNo, 
                    y : ((item.hours/(40*noMembers))*100).toFixed(0)
                })
        }, data)

        return arr
    }

    PlotUserUtilizationPerWeek(user,n){
        let data = this.UserHoursPerWeek(user,n)
        let arr = []

        R.forEach((item) =>{ 
            arr.push({
                    x : item.weekNo, 
                    y : ((item.hours/40)*100).toFixed(0)
                })
        }, data)

        return arr
    }

    PlotUserHoursPerWeek(user,n){
        let data = this.UserHoursPerWeek(user,n)
        let arr = []

        R.forEach((item) =>{ 
            arr.push({
                    x : item.weekNo, 
                    y : item.hours
                })
        }, data)

        return arr
    }

    PlotTimeline(){
        let data = R.compose(this.sortByEnd,this.filterPending)(this.data)

        let arr = []
        let start = ''
        let end = ''

        R.forEach((item) =>{ 
            start = item.start == '' ? moment().format("x") : moment(item.start).format("x")
            end = moment(item.end).format("x")
            arr.push({
                    x : item.name, 
                    //y : [new Date(start).getTime(),new Date(end).getTime()]
                    y : [start, end]
                })
        }, data)

        return arr
    }

    TotalHoursPerWeek(n){
        return R.compose(
            this.takeAny(n),
            this.sumHours,
            this.groupByWeekNo,
            this.pickFields(['weekNo','hours','name','number']),
            this.sortByWeekNo,
            this.filterBillable, 
            this.filterPending
        )(this.modifiedData)
    }

    UserHoursPerWeek(user,n){
        return R.compose(
            this.takeAny(n),
            this.sumHours,
            this.groupByWeekNo,
            this.pickFields(['weekNo','hours','name','number']),
            this.sortByWeekNo,
            this.filterByTo(user),
            this.filterBillable, 
            this.filterPending
        )(this.modifiedData)
    }

    UserHoursByWeekNo(weekNo,user){
        let _hours = R.compose(
            this.total, 
            this.pluckByKey('hours'),
            this.filterByWeekNo(weekNo), 
            this.filterByTo(user),
            this.filterBillable, 
            this.filterPending
        )(this.modifiedData)

        return _hours.toFixed(0)
    }

    UserUtilizationByWeekNo(weekNo,user){
        let _hours = R.compose(
            this.total, 
            this.pluckByKey('hours'),
            this.filterByWeekNo(weekNo), 
            this.filterByTo(user),
            this.filterBillable, 
            this.filterPending
        )(this.modifiedData)
        return (_hours/40 * 100).toFixed(0)+"%"
    }

    UserBillableHoursByWeekNo(user, weekNo){
        return R.compose(
            //this.pickFields(['to','number','name','description','hours','weekNo']),
            this.pickFields(['number','name','description','hours']),
            this.filterByWeekNo(weekNo),
            this.filterByTo(user)
        )(this.modifiedData)
    }

    TotalBillableHours(){
        return R.compose(
            this.total,
            this.pluckByKey('hours'),
            this.filterBillable
        )(this.modifiedData)
    }

    GroupPendingByEndDateForCurrentWeek(){
        return R.compose(
            //this.groupByEndDate,
            this.groupByDayOfWeek,
            this.filterBetweenDates(this.currentWeekRange().start,this.currentWeekRange().end),
            this.filterPending
        )(this.data)
    }

    GroupPendingByName(){
        // return R.compose(
        //     this.groupByName,
        //     this.filterPending
        // )(this.data)

        let data =  R.compose(
            this.groupByTo,
            //this.filterByName('Avid Hotel'),
            this.filterPending
        )(this.data)

        console.log(data)

        return data
    }

    GroupPendingByUser(){
        let data =  R.compose(
            this.sortByEnd,
            this.groupByTo,
            this.filterPending
        )(this.data)
        
        console.log(data)
        return data
    }

    



   



}//CLASS