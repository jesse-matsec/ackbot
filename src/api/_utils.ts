import type { VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import { SLACK_TOKEN } from './_constants';

export async function postToChannel(channel: string, res: VercelResponse, payload: string) {
	console.log('channel:', channel);
	const channelId = await channelNameToId(channel);

	console.log('ID:', channelId);

	const message = {
		channel: channelId,
		text: payload,
	};

	try {
		const url = 'https://slack.com/api/chat.postMessage';
		const response = await fetch(url, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: `Bearer ${SLACK_TOKEN}`,
			},
			body: JSON.stringify(message),
		});
		const data = await response.json();

		console.log('data from fetch:', data);
		res.json({ ok: true });
	} catch (err) {
		console.log('fetch Error:', err);
		res.send({
			response_type: 'ephemeral',
			text: `${err}`,
		});
	}
}

async function channelNameToId(channelName: string) {
	let generalId;
	let id;

	try {
		const url = 'https://slack.com/api/conversations.list';
		const response = await fetch(url, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: `Bearer ${SLACK_TOKEN}`,
			},
		});
		const data: { channels: { name: string, id: string }[] } = await response.json();

		data.channels.forEach((element) => {
			if (element.name === channelName) {
				id = element.id;
			}
			if (element.name === 'general') generalId = element.id;
		});
		if (id) {
			return id;
		} else return generalId;
	} catch (err) {
		console.log('fetch Error:', err);
	}
	return id;
}