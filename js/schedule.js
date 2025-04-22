const $university = document.querySelector("#university")
const $station = document.querySelector("#station")
const $daiya_change = document.querySelector("#daiya_change")
const $update_day = document.querySelector("#update_day")
const $time = document.querySelector("#time")
const $destination = document.querySelector("#destination")
const $daiya = document.querySelector("#daiya")

const $scroll_box = document.querySelector(".scroll-box")

const university = "龍谷大学"
const station = "瀬田駅"
let distination = university

let timetable = null
let is_week = null
let is_week_jp = null
let is_week_change = true

$university.addEventListener("click", () => {
    distination = university
    set_box()
    $destination.textContent = distination
})

$station.addEventListener("click", () => {
    distination = station
    set_box()
    $destination.textContent = distination
})

$daiya_change.addEventListener("click", () => {
    is_week_change = false
    is_week = (is_week=="weekend") ? "weekday" : "weekend"
    is_week_jp = (is_week_jp=="休日ダイヤ") ? "平日ダイヤ" : "休日ダイヤ"
    set_box()
    $daiya.textContent = is_week_jp
})

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

function zero(num){
    if(num < 10){
        return `0${String(num)}`
    }else{
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

function schedule_date(hour,minute){
    return `${is_noon(hour)}時${gettwo(minute)}分`
}

function insert_box(date){
    const schedule = timetable[distination][is_week]
    const hour = date.getHours()
    const minute = date.getMinutes()
    let i = 0
    let j = 0
    let num = 0
    let flag = false
    let is_hour = false
    let is_next_hour = false
    for(const s of schedule){
        if(hour == i) is_hour = true
        for(const t of s){
            if(is_hour){
                if(!flag && minute < t || !flag && is_next_hour){
                    flag = true
                    num = j
                }
            }
            const div = document.createElement("div")
            div.classList.add("item")
            div.textContent = schedule_date(i,t)
            $scroll_box.insertAdjacentElement("beforeend",div)
            j++
        }
        if(is_hour) is_next_hour = true
        i++
    }
    if(num > 1){
        num -= 1
    }
    return num
}

function set_box(){
    const date = new Date
    $scroll_box.innerHTML = ""
    const num = insert_box(date)
    const $items = document.querySelectorAll(".item")
    if ($items[num]) {
        $items[num].scrollIntoView({ behavior: "smooth", block: "start" })
    }
}

function main(){
    const date = new Date
    if(is_week_change){
        const weekday = date.getDay()
        is_week = (0 < weekday && weekday < 6) ? "weekday" : "weekend"
        is_week_jp = "休日ダイヤ" ? "平日ダイヤ" : "休日ダイヤ"
        $daiya.textContent = is_week_jp
    }    
    nowtime(date)
}

window.onload = function(){
    fetch("data/timetable.json")
        .then(response => response.json())
        .then(data => {
            const date = new Date
            const weekday = date.getDay()
            is_week = (0 < weekday && weekday < 6) ? "weekday" : "weekend"
            is_week_jp = "休日ダイヤ" ? "平日ダイヤ" : "休日ダイヤ"
            $daiya.textContent = is_week_jp
            timetable = data
            $update_day.textContent = timetable["更新日"]
            set_box(date)
            setInterval(main,100)
        })
        .catch(error => {
            console.log("エラー：", error)
        })
}