require( 'chromedriver' )
const { Builder, By, Key, until, Capabilities } = require( 'selenium-webdriver' )

const testUrl = 'http://blog.csssr.ru/qa-engineer/'
const distributionOfDuties = 'РАСПРЕДЕЛЕНИЕ ОБЯЗАННОСТЕЙ'
const tabFindImperfections = 'НАХОДИТЬ НЕСОВЕРШЕНСТВА'
const nameCheckedLink = 'Софт для быстрого создания скриншотов'
const urlCheckedLink = 'http://monosnap.com/'

const message = 'Все отлично! Ссылка «Софт для быстрого создания скриншотов» ведет на http://monosnap.com/ и открывается в новом окне'
const errorMessage = 'Ссылка «Софт для быстрого создания скриншотов» должна вести сюда http://monosnap.com/ и открывается в новом окне'


const capabilities = {
    'browserName': 'chrome',
    'chromeOptions': {
        'args': [
            '--test-type',
            '--incognito'
        ]
    }
}

const driver = new Builder()
    .withCapabilities( capabilities )
    .build()

driver
    .manage()
    .window()
    .maximize()

const scrollTo = (element) => {
    element.scrollIntoView( { block: 'start', behavior: 'smooth' } )
}

const findTagWithText = (tag, text, timeAwait = 3000) => {
    return driver.wait( until.elementLocated( By.xpath( `//${ tag }[contains(text(), '${ text }')]` ) ), timeAwait )
}

driver
    .get( testUrl )
    .then( async () => {


        const section = await findTagWithText( 'h1', distributionOfDuties )

        await driver.sleep( 500 )

        await driver.executeScript(
            scrollTo,
            section
        )

        const tab = await findTagWithText( 'a', tabFindImperfections )
        await driver.sleep( 500 )
        tab.click()

        const checkedLink = await findTagWithText( 'a', nameCheckedLink )
        await driver.sleep( 500 )
        await driver.executeScript(
            scrollTo,
            checkedLink
        )

        const checkUrl = await checkedLink.getAttribute( 'href' )

        if (checkUrl === urlCheckedLink) {
            console.log( message )
        } else {
            console.log( `
            Все Пропало!
            Страница открыта по ссылке ${ checkUrl }.
            Хотя должно быть так: ${ errorMessage }
            ` )
        }

        await driver.sleep( 500 )
        checkedLink.click()
    } )

