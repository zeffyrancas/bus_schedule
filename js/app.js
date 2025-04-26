const $university = document.querySelector("#university")
const $station = document.querySelector("#station")
const $daiya_change = document.querySelector("#daiya_change")
const $update_day = document.querySelector("#update_day")
const $time = document.querySelector("#time")
const $destination = document.querySelector("#destination")
const $daiya = document.querySelector("#daiya")

const $first_next = document.querySelector("#first_next")
const $first_next_time = document.querySelector("#first_next_time")
const $second_next = document.querySelector("#second_next")
const $second_next_time = document.querySelector("#second_next_time")

const university = "龍谷大学"
const station = "瀬田駅"
let distination = university

let timetable = null
let is_week = null
let is_week_jp = null
let is_week_change = true

$university.addEventListener("click", () => {
    init_box()
    distination = university
    $destination.textContent = distination
})

$station.addEventListener("click", () => {
    init_box()
    distination = station
    $destination.textContent = distination
})

$daiya_change.addEventListener("click", () => {
    init_box()
    is_week_change = false
    is_week = daiya_change(is_week)
    is_week_jp = daiya_change_jp(is_week_jp)
    $daiya.textContent = is_week_jp
})

function init_box(){
    $first_next.textContent = ""
    $first_next_time.textContent = ""
    $second_next.textContent = ""
    $second_next_time.textContent = ""
}

function daiya_change(is_week){
    if(is_week == "weekday"){
        return "saturday"
    }else if(is_week == "saturday"){
        return "other"
    }else if(is_week == "other"){
        return "weekday"
    }
}

function daiya_change_jp(is_week){
    if(is_week == "平日ダイヤ"){
        return "土曜ダイヤ"
    }else if(is_week == "土曜ダイヤ"){
        return "日祝ダイヤ"
    }else if(is_week == "日祝ダイヤ"){
        return "平日ダイヤ"
    }
}

function is_noon(num){
    if(num < 13){
        return `午前${String(gettwo(num))}`
    }
    else{
        num -= 12
        return `午後${String(gettwo(num))}`
    }
}

function gettwo(num){
    if(num < 10){
        return " " + String(num)
    }
    else{
        return String(num)
    }
}

function date_str(date,flag){
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if(flag){
        return `${is_noon(hour)}時${gettwo(minute)}分${zero(second)}秒`
    }
    else{
        return `${is_noon(hour)}時${zero(minute)}分`
    }
}

function nowtime(date){
    $time.textContent = date_str(date,true)
}

function to_seconds(date){
    const hour2 = date.getHours()
    const minute2 = date.getMinutes()
    const second2 = date.getSeconds()
    return hour2 * 60 * 60 + minute2 * 60 + second2 
}

function to_time_str(seconds){
    const hour3 = Math.floor(seconds / (60 * 60))
    const minute3 = Math.floor((seconds % (60 * 60)) / 60)
    const second3 = (seconds - hour3) % 60
    if(hour3 > 0 && minute3 > 0){
        return `${hour3}時間${zero(minute3)}分${zero(second3)}秒`
    }else if(minute3 > 0){
        return `${minute3}分${zero(second3)}秒`
    }else{
        return `${zero(second3)}秒`
    }
}

function zero(num){
    if(num < 10){
        return `0${String(num)}`
    }else{
        return String(num)
    }
}

function diff(date,time){
    diff_seconds = to_seconds(time) - to_seconds(date)
    return to_time_str(diff_seconds)
}

function bus_next(date){
    const date2 = new Date
    const date3 = new Date
    const schedule = timetable[distination][is_week]
    const hour = date.getHours()
    const minute = date.getMinutes()
    let i = 0
    let is_first_next = false
    let is_second_next = false
    let is_hour = false
    let is_next_hour = false
    let first = null
    let second = null
    for(const s of schedule){
        if(hour == i) is_hour = true
        if(is_hour){
            for(const t of s){
                if((is_first_next && minute < t) || (is_first_next && is_next_hour)){
                    is_second_next = true
                    second = [i,t]
                    break
                }
                if(!is_first_next && minute < t || !is_first_next && is_next_hour){
                    is_first_next = true
                    first = [i,t] 
                }
            }
        }
        if(is_hour) is_next_hour = true
        if(is_second_next) break
        i++
    }

    if(is_first_next){
        const first_time = make_dates(date2, first)
        $first_next.textContent = date_str(first_time,false)
        $first_next_time.textContent = diff(date,first_time)
        if(is_second_next){
            const second_time = make_dates(date3,second)
            $second_next.textContent = date_str(second_time,false)
            $second_next_time.textContent = diff(date,second_time)

        }else{
            $second_next.textContent = "本日の便はあと１便です。"
        }
    }else{
        $first_next.textContent = "本日の便はすべて終了しました。"
        $second_next.textContent = ""
    }
}

function make_dates(date,array){
    const make_hour = array[0]
    const make_minute = array[1]
    const make_second = 0
    let make_date = date
    make_date.setHours(make_hour)
    make_date.setMinutes(make_minute)
    make_date.setSeconds(make_second)
    return make_date
}

function week(weekday){
    if(0 < weekday && weekday < 5){
        return "weekday"
    }else if(weekday == 6){
        return "saturday"
    }else{
        return "other"
    }
} 

function week_jp(weekday){
    if(0 < weekday && weekday < 5){
        return "平日ダイヤ"
    }else if(weekday == 6){
        return "土曜ダイヤ"
    }else{
        return "日祝ダイヤ"
    }
} 

function main(){
    const date = new Date
    if(is_week_change){
        const weekday = date.getDay()
        is_week = week(weekday)
        is_week_jp = week_jp(weekday)
        $daiya.textContent = is_week_jp
    }    
    nowtime(date)
    bus_next(date)
}

window.onload = function(){
    init_box()
    fetch("data/timetable.json")
        .then(response => response.json())
        .then(data => {
            timetable = data
            $update_day.textContent = timetable["更新日"]
            setInterval(main,100)
        })
        .catch(error => {
            console.log("エラー：", error)
        })
}
