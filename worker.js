export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Moderator login
    if(url.pathname === "/auth"){
      const { modId } = await request.json();
      const valid = await env.MODERATOR_IDS.get(modId);
      return new Response(JSON.stringify({authorized: !!valid}), {
        headers: {"Content-Type": "application/json"}
      });
    }

    // Get submitted levels
    if(url.pathname === "/submissions"){
      const list = await env.LEVEL_SUBMISSIONS.list();
      const data = [];
      for(const key of list.keys){
        data.push(await env.LEVEL_SUBMISSIONS.get(key.name, "json"));
      }
      return Response.json(data);
    }

    // Get logs
    if(url.pathname === "/logs"){
      const list = await env.LEVEL_LOGS.list();
      const data = [];
      for(const key of list.keys){
        data.push(await env.LEVEL_LOGS.get(key.name, "json"));
      }
      return Response.json(data);
    }

    return new Response("Not Found", {status: 404});
  }
};
